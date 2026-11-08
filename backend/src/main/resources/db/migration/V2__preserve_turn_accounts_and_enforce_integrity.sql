-- V2__preserve_turn_accounts_and_enforce_integrity.sql
-- Completa reglas estructurales sin modificar V1, que ya pudo ejecutarse en otros ambientes.

ALTER TABLE user_bank_accounts
    ADD CONSTRAINT uq_user_bank_accounts_id_user UNIQUE (id, user_id);

ALTER TABLE participations
    ADD CONSTRAINT uq_participations_id_user UNIQUE (id, user_id);

ALTER TABLE participations
    ADD CONSTRAINT fk_participations_user_bank_account_owner
    FOREIGN KEY (user_bank_account_id, user_id)
    REFERENCES user_bank_accounts (id, user_id)
    ON DELETE RESTRICT;

ALTER TABLE user_bank_accounts
    ADD CONSTRAINT uq_user_bank_accounts_id_user_bank UNIQUE (id, user_id, bank_account_id);

ALTER TABLE turns
    ADD COLUMN receiver_user_id UUID,
    ADD COLUMN receiver_user_bank_account_id UUID,
    ADD COLUMN receiver_bank_account_id UUID,
    ADD COLUMN receiver_pey_bank_account_id_snapshot VARCHAR(120),
    ADD COLUMN receiver_clabe_snapshot VARCHAR(18),
    ADD COLUMN receiver_account_name_snapshot VARCHAR(160);

UPDATE turns t
SET receiver_user_id = p.user_id,
    receiver_user_bank_account_id = p.user_bank_account_id,
    receiver_bank_account_id = uba.bank_account_id,
    receiver_pey_bank_account_id_snapshot = ba.pey_bank_account_id,
    receiver_clabe_snapshot = ba.clabe,
    receiver_account_name_snapshot = ba.account_name
FROM participations p
JOIN user_bank_accounts uba ON uba.id = p.user_bank_account_id
JOIN bank_accounts ba ON ba.id = uba.bank_account_id
WHERE t.receiver_participation_id = p.id;

ALTER TABLE turns
    ADD CONSTRAINT fk_turns_receiver_participation_user
    FOREIGN KEY (receiver_participation_id, receiver_user_id)
    REFERENCES participations (id, user_id)
    ON DELETE RESTRICT,
    ADD CONSTRAINT fk_turns_receiver_account_owner
    FOREIGN KEY (
        receiver_user_bank_account_id,
        receiver_user_id,
        receiver_bank_account_id
    )
    REFERENCES user_bank_accounts (id, user_id, bank_account_id)
    ON DELETE RESTRICT,
    ADD CONSTRAINT ck_turns_receiver_account_snapshot
    CHECK (
        (
            receiver_participation_id IS NULL
            AND receiver_user_id IS NULL
            AND receiver_user_bank_account_id IS NULL
            AND receiver_bank_account_id IS NULL
            AND receiver_pey_bank_account_id_snapshot IS NULL
        )
        OR
        (
            receiver_participation_id IS NOT NULL
            AND receiver_user_id IS NOT NULL
            AND receiver_user_bank_account_id IS NOT NULL
            AND receiver_bank_account_id IS NOT NULL
            AND receiver_pey_bank_account_id_snapshot IS NOT NULL
        )
    ),
    ADD CONSTRAINT ck_turns_receiver_clabe_snapshot
    CHECK (
        receiver_clabe_snapshot IS NULL
        OR receiver_clabe_snapshot ~ '^[0-9]{18}$'
    );

CREATE INDEX idx_turns_receiver_bank_account
    ON turns(receiver_bank_account_id)
    WHERE receiver_bank_account_id IS NOT NULL;

CREATE OR REPLACE FUNCTION enforce_bank_account_user_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    associated_users INTEGER;
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.bank_account_id = OLD.bank_account_id THEN
        RETURN NEW;
    END IF;

    PERFORM pg_advisory_xact_lock(
        hashtextextended(NEW.bank_account_id::TEXT, 0)
    );

    IF TG_OP = 'UPDATE' THEN
        SELECT COUNT(*)
          INTO associated_users
          FROM user_bank_accounts
         WHERE bank_account_id = NEW.bank_account_id
           AND id <> NEW.id;
    ELSE
        SELECT COUNT(*)
          INTO associated_users
          FROM user_bank_accounts
         WHERE bank_account_id = NEW.bank_account_id;
    END IF;

    IF associated_users >= 5 THEN
        RAISE EXCEPTION 'Una cuenta bancaria no puede asociarse con más de cinco usuarios.'
            USING ERRCODE = '23514';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_bank_account_user_limit
BEFORE INSERT OR UPDATE OF bank_account_id
ON user_bank_accounts
FOR EACH ROW
EXECUTE FUNCTION enforce_bank_account_user_limit();

CREATE UNIQUE INDEX uq_users_email_normalized
    ON users (LOWER(BTRIM(email)));

CREATE UNIQUE INDEX uq_webhook_events_transaction_id
    ON webhook_events(transaction_id)
    WHERE transaction_id IS NOT NULL;

ALTER TABLE turn_assignment_history
    DROP CONSTRAINT ck_turn_assignment_history_action;

ALTER TABLE turn_assignment_history
    ADD CONSTRAINT ck_turn_assignment_history_action
    CHECK (action IN ('ASSIGNED', 'CANCELLED', 'REASSIGNED', 'RELEASED'));

-- Fin de V2.
