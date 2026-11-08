-- A CLABE is registered once in the platform and shared through user_bank_accounts.
CREATE UNIQUE INDEX uq_bank_accounts_clabe
    ON bank_accounts(clabe)
    WHERE clabe IS NOT NULL;
