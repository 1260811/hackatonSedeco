package mx.sedeco.tandas.bankaccounts.application;

import com.fasterxml.jackson.databind.JsonNode;
import mx.sedeco.tandas.pey.infrastructure.PeyApiClient;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.UUID;

@Service
public class PeyBankAccountService {
    private final JdbcTemplate jdbcTemplate;
    private final PeyApiClient peyApiClient;

    public PeyBankAccountService(JdbcTemplate jdbcTemplate, PeyApiClient peyApiClient) {
        this.jdbcTemplate = jdbcTemplate;
        this.peyApiClient = peyApiClient;
    }

    @Transactional
    public BankAccountResult registerForUser(UUID userId, RegisterBankAccountCommand command) {
        validate(command);

        Boolean userExists = jdbcTemplate.queryForObject(
            "SELECT EXISTS (SELECT 1 FROM users WHERE id = ? AND status = 'ACTIVE')",
            Boolean.class, userId
        );
        if (!Boolean.TRUE.equals(userExists)) {
            throw new IllegalArgumentException("Active user does not exist");
        }

        jdbcTemplate.queryForObject(
            "SELECT pg_advisory_xact_lock(hashtext(?))",
            Object.class, command.clabe()
        );

        ExistingAccount existing = jdbcTemplate.query("""
            SELECT id, pey_bank_account_id, pey_status, clabe
              FROM bank_accounts
             WHERE clabe = ?
             FOR UPDATE
            """, rs -> rs.next() ? new ExistingAccount(
                rs.getObject("id", UUID.class),
                rs.getString("pey_bank_account_id"),
                rs.getString("pey_status"),
                rs.getString("clabe")
            ) : null, command.clabe());

        UUID bankAccountId;
        String peyId;
        String status;
        boolean owner;

        if (existing != null) {
            Boolean alreadyAssociated = jdbcTemplate.queryForObject(
                "SELECT EXISTS (SELECT 1 FROM user_bank_accounts WHERE user_id = ? AND bank_account_id = ? AND status = 'ACTIVE')",
                Boolean.class, userId, existing.id()
            );
            if (!Boolean.TRUE.equals(alreadyAssociated)) {
                throw new IllegalStateException("This CLABE is already registered; a separate authorized sharing flow is required");
            }
            bankAccountId = existing.id();
            peyId = existing.peyBankAccountId();
            status = refreshStatus(peyId);
            owner = false;
        } else {
            if (!command.declaresTitularity()) {
                throw new IllegalArgumentException("The user must declare titularity before registering a new bank account");
            }
            var registered = peyApiClient.registerBankAccount(
                new PeyApiClient.RegisterBankAccountRequest(
                    command.alias(), command.name(), command.clabe(), command.entity().toUpperCase(Locale.ROOT)
                )
            );
            if (registered.id() == null || registered.id().isBlank()) {
                throw new IllegalStateException("Pey did not return a bankAccountId");
            }
            peyId = registered.id();
            status = normalizeStatus(registered.codiStatus());
            bankAccountId = jdbcTemplate.queryForObject("""
                INSERT INTO bank_accounts (pey_bank_account_id, clabe, account_name, pey_status)
                VALUES (?, ?, ?, ?)
                RETURNING id
                """, UUID.class, peyId, command.clabe(), command.name(), status);
            owner = true;
        }

        jdbcTemplate.update("""
            INSERT INTO user_bank_accounts (user_id, bank_account_id, is_owner, status)
            VALUES (?, ?, ?, 'ACTIVE')
            ON CONFLICT (user_id, bank_account_id) DO NOTHING
            """, userId, bankAccountId, owner);

        return new BankAccountResult(bankAccountId, peyId, command.clabe(), status);
    }

    @Transactional
    public BankAccountResult refresh(UUID bankAccountId) {
        ExistingAccount account = jdbcTemplate.query("""
            SELECT id, pey_bank_account_id, pey_status, clabe
              FROM bank_accounts
             WHERE id = ?
             FOR UPDATE
            """, rs -> rs.next() ? new ExistingAccount(
                rs.getObject("id", UUID.class),
                rs.getString("pey_bank_account_id"),
                rs.getString("pey_status"),
                rs.getString("clabe")
            ) : null, bankAccountId);

        if (account == null) throw new IllegalArgumentException("Bank account does not exist");
        String status = refreshStatus(account.peyBankAccountId());
        return new BankAccountResult(account.id(), account.peyBankAccountId(), account.clabe(), status);
    }

    private String refreshStatus(String peyBankAccountId) {
        JsonNode response = peyApiClient.getBankAccount(peyBankAccountId);
        String status = normalizeStatus(response.path("codiStatus").asText(null));
        jdbcTemplate.update("""
            UPDATE bank_accounts
               SET pey_status = ?, updated_at = CURRENT_TIMESTAMP
             WHERE pey_bank_account_id = ?
            """, status, peyBankAccountId);
        return status;
    }

    private String normalizeStatus(String status) {
        if (status == null) return "PENDING";
        return switch (status.toUpperCase(Locale.ROOT)) {
            case "PENDING", "PROCESSING" -> "PENDING";
            case "ACTIVE" -> "ACTIVE";
            case "ERROR" -> "ERROR";
            default -> throw new IllegalStateException("Unknown Pey account status: " + status);
        };
    }

    private void validate(RegisterBankAccountCommand command) {
        if (command == null || command.alias() == null || command.alias().isBlank()
            || command.name() == null || command.name().isBlank()
            || command.clabe() == null || !command.clabe().matches("[0-9]{18}")
            || command.entity() == null
            || !command.entity().matches("(?i)PERSON|BUSINESS")) {
            throw new IllegalArgumentException("Alias, name, valid 18-digit CLABE and PERSON/BUSINESS entity are required");
        }
    }

    private record ExistingAccount(UUID id, String peyBankAccountId, String status, String clabe) {}

    public record RegisterBankAccountCommand(String alias, String name, String clabe, String entity, boolean declaresTitularity) {}

    public record BankAccountResult(UUID bankAccountId, String peyBankAccountId, String clabe, String peyStatus) {}
}
