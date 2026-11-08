-- V1__create_initial_schema.sql
-- MVP de Tandas / Pey
-- PostgreSQL 17 + Flyway
-- UUID, TIMESTAMPTZ y NUMERIC para importes. No se eliminan movimientos financieros en cascada.

-- ---------------------------------------------------------------------------
-- 1. Identidad y cuentas bancarias
-- ---------------------------------------------------------------------------

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(30),
    password_hash TEXT NOT NULL,
    full_name VARCHAR(160) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT ck_users_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'BLOCKED'))
);

CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pey_bank_account_id VARCHAR(120) NOT NULL,
    clabe VARCHAR(18),
    account_name VARCHAR(160),
    pey_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_bank_accounts_pey_id UNIQUE (pey_bank_account_id),
    CONSTRAINT ck_bank_accounts_pey_status
        CHECK (pey_status IN ('PENDING', 'ACTIVE', 'INACTIVE', 'BLOCKED', 'ERROR')),
    CONSTRAINT ck_bank_accounts_clabe
        CHECK (clabe IS NULL OR clabe ~ '^[0-9]{18}$')
);

CREATE TABLE user_bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    bank_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE RESTRICT,
    is_owner BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_bank_accounts_pair UNIQUE (user_id, bank_account_id),
    CONSTRAINT ck_user_bank_accounts_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING'))
);

-- ---------------------------------------------------------------------------
-- 2. Tandas, solicitudes, participaciones y convenios
-- ---------------------------------------------------------------------------

CREATE TABLE tandas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    contribution_amount NUMERIC(12,2) NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    first_turn_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_tandas_contribution CHECK (contribution_amount > 0),
    CONSTRAINT ck_tandas_frequency CHECK (frequency IN ('WEEKLY', 'BIWEEKLY', 'MONTHLY')),
    CONSTRAINT ck_tandas_status CHECK (
        status IN ('DRAFT', 'ACTIVE', 'PAUSED', 'CANCELLATION_PENDING',
                   'SETTLING', 'COMPLETED', 'CANCELLED')
    )
);

CREATE TABLE participation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tanda_id UUID NOT NULL REFERENCES tandas(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    request_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    CONSTRAINT ck_participation_requests_type
        CHECK (request_type IN ('INVITATION', 'JOIN_REQUEST')),
    CONSTRAINT ck_participation_requests_status
        CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'))
);

CREATE TABLE participations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tanda_id UUID NOT NULL REFERENCES tandas(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    user_bank_account_id UUID NOT NULL REFERENCES user_bank_accounts(id) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_participations_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'WITHDRAWN'))
);

CREATE TABLE agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tanda_id UUID NOT NULL REFERENCES tandas(id) ON DELETE RESTRICT,
    version INTEGER NOT NULL,
    contribution_amount NUMERIC(12,2) NOT NULL,
    due_days_before_turn INTEGER NOT NULL DEFAULT 0,
    grace_period_days INTEGER NOT NULL DEFAULT 0,
    penalty_type VARCHAR(20) NOT NULL DEFAULT 'NONE',
    penalty_value NUMERIC(12,2) NOT NULL DEFAULT 0,
    penalty_frequency_days INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_agreements_tanda_version UNIQUE (tanda_id, version),
    CONSTRAINT ck_agreements_version CHECK (version > 0),
    CONSTRAINT ck_agreements_contribution CHECK (contribution_amount > 0),
    CONSTRAINT ck_agreements_due_days CHECK (due_days_before_turn >= 0),
    CONSTRAINT ck_agreements_grace CHECK (grace_period_days >= 0),
    CONSTRAINT ck_agreements_penalty_type
        CHECK (penalty_type IN ('NONE', 'FIXED', 'PERCENTAGE')),
    CONSTRAINT ck_agreements_penalty_value CHECK (penalty_value >= 0),
    CONSTRAINT ck_agreements_penalty_frequency
        CHECK (
            (penalty_type = 'NONE' AND penalty_frequency_days IS NULL)
            OR
            (penalty_type <> 'NONE' AND penalty_frequency_days > 0)
        )
);

CREATE TABLE agreement_acceptances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id UUID NOT NULL REFERENCES agreements(id) ON DELETE RESTRICT,
    participation_id UUID NOT NULL REFERENCES participations(id) ON DELETE RESTRICT,
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_agreement_acceptances UNIQUE (agreement_id, participation_id)
);

-- ---------------------------------------------------------------------------
-- 3. Turnos, reservas e historial
-- ---------------------------------------------------------------------------

CREATE TABLE turns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tanda_id UUID NOT NULL REFERENCES tandas(id) ON DELETE RESTRICT,
    turn_number INTEGER NOT NULL,
    receiver_participation_id UUID REFERENCES participations(id) ON DELETE RESTRICT,
    scheduled_date DATE,
    original_scheduled_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_turns_tanda_number UNIQUE (tanda_id, turn_number),
    CONSTRAINT ck_turns_number CHECK (turn_number > 0),
    CONSTRAINT ck_turns_status
        CHECK (status IN ('AVAILABLE', 'RESERVED', 'ASSIGNED', 'COMPLETED', 'CANCELLED'))
);

CREATE TABLE turn_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    turn_id UUID NOT NULL REFERENCES turns(id) ON DELETE RESTRICT,
    participation_id UUID NOT NULL REFERENCES participations(id) ON DELETE RESTRICT,
    reserved_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    released_at TIMESTAMPTZ,
    CONSTRAINT ck_turn_reservations_status
        CHECK (status IN ('ACTIVE', 'CONFIRMED', 'EXPIRED', 'RELEASED')),
    CONSTRAINT ck_turn_reservations_dates CHECK (expires_at > reserved_at)
);

CREATE UNIQUE INDEX uq_turn_reservations_one_active_per_turn
    ON turn_reservations(turn_id)
    WHERE status = 'ACTIVE';

CREATE TABLE turn_assignment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    turn_id UUID NOT NULL REFERENCES turns(id) ON DELETE RESTRICT,
    participation_id UUID NOT NULL REFERENCES participations(id) ON DELETE RESTRICT,
    action VARCHAR(20) NOT NULL,
    performed_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_turn_assignment_history_action
        CHECK (action IN ('ASSIGNED', 'CANCELLED'))
);

CREATE TABLE turn_schedule_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    turn_id UUID NOT NULL REFERENCES turns(id) ON DELETE RESTRICT,
    previous_date DATE,
    new_date DATE NOT NULL,
    reason TEXT,
    changed_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- 4. Obligaciones, solicitudes de cobro, intentos y sanciones
-- ---------------------------------------------------------------------------

CREATE TABLE payment_obligations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tanda_id UUID NOT NULL REFERENCES tandas(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    period_number INTEGER NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_payment_obligations_period UNIQUE (tanda_id, user_id, period_number),
    CONSTRAINT ck_payment_obligations_period CHECK (period_number > 0),
    CONSTRAINT ck_payment_obligations_amount CHECK (total_amount >= 0),
    CONSTRAINT ck_payment_obligations_status
        CHECK (status IN ('PENDING', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED'))
);

CREATE TABLE obligation_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_obligation_id UUID NOT NULL REFERENCES payment_obligations(id) ON DELETE RESTRICT,
    turn_id UUID NOT NULL REFERENCES turns(id) ON DELETE RESTRICT,
    receiver_participation_id UUID NOT NULL REFERENCES participations(id) ON DELETE RESTRICT,
    amount NUMERIC(12,2) NOT NULL,
    due_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    CONSTRAINT uq_obligation_details_turn UNIQUE (payment_obligation_id, turn_id),
    CONSTRAINT ck_obligation_details_amount CHECK (amount > 0),
    CONSTRAINT ck_obligation_details_status
        CHECK (status IN ('PENDING', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED'))
);

CREATE TABLE payment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_obligation_id UUID NOT NULL REFERENCES payment_obligations(id) ON DELETE RESTRICT,
    bank_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE RESTRICT,
    receiver_pey_bank_account_id VARCHAR(120) NOT NULL,
    receiver_clabe_snapshot VARCHAR(18),
    receiver_account_name_snapshot VARCHAR(160),
    amount NUMERIC(12,2) NOT NULL,
    due_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_payment_requests_amount CHECK (amount > 0),
    CONSTRAINT ck_payment_requests_status
        CHECK (status IN ('PENDING', 'GENERATING', 'ACTIVE', 'PAID', 'EXPIRED', 'FAILED', 'CANCELLED'))
);

CREATE TABLE penalties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obligation_detail_id UUID NOT NULL REFERENCES obligation_details(id) ON DELETE RESTRICT,
    amount NUMERIC(12,2) NOT NULL,
    base_amount NUMERIC(12,2) NOT NULL,
    penalty_type VARCHAR(20) NOT NULL,
    penalty_value NUMERIC(12,2) NOT NULL,
    calculation_period_days INTEGER NOT NULL,
    calculation_period INTEGER NOT NULL,
    period_number INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_penalties_detail_period UNIQUE (obligation_detail_id, period_number),
    CONSTRAINT ck_penalties_amounts CHECK (amount >= 0 AND base_amount > 0 AND penalty_value >= 0),
    CONSTRAINT ck_penalties_type CHECK (penalty_type IN ('FIXED', 'PERCENTAGE')),
    CONSTRAINT ck_penalties_periods
        CHECK (calculation_period_days > 0 AND calculation_period > 0 AND period_number > 0),
    CONSTRAINT ck_penalties_status CHECK (status IN ('PENDING', 'PAID', 'CANCELLED'))
);

CREATE TABLE payment_request_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_request_id UUID NOT NULL REFERENCES payment_requests(id) ON DELETE RESTRICT,
    item_type VARCHAR(20) NOT NULL,
    obligation_detail_id UUID REFERENCES obligation_details(id) ON DELETE RESTRICT,
    penalty_id UUID REFERENCES penalties(id) ON DELETE RESTRICT,
    amount NUMERIC(12,2) NOT NULL,
    CONSTRAINT ck_payment_request_items_type CHECK (item_type IN ('CONTRIBUTION', 'PENALTY')),
    CONSTRAINT ck_payment_request_items_target CHECK (
        (obligation_detail_id IS NOT NULL AND penalty_id IS NULL AND item_type = 'CONTRIBUTION')
        OR
        (obligation_detail_id IS NULL AND penalty_id IS NOT NULL AND item_type = 'PENALTY')
    ),
    CONSTRAINT ck_payment_request_items_amount CHECK (amount > 0)
);

CREATE TABLE payment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_request_id UUID NOT NULL REFERENCES payment_requests(id) ON DELETE RESTRICT,
    attempt_number INTEGER NOT NULL,
    pey_reference VARCHAR(160),
    payment_method VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CREATED',
    qr_payload TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_payment_attempts_number UNIQUE (payment_request_id, attempt_number),
    CONSTRAINT ck_payment_attempts_number CHECK (attempt_number > 0),
    CONSTRAINT ck_payment_attempts_method CHECK (payment_method IN ('CODI_QR', 'CODI_PUSH')),
    CONSTRAINT ck_payment_attempts_status
        CHECK (status IN ('CREATED', 'PENDING', 'SUCCEEDED', 'FAILED', 'EXPIRED', 'CANCELLED'))
);

-- ---------------------------------------------------------------------------
-- 5. Pagos, asignaciones, transacciones Pey y webhooks
-- ---------------------------------------------------------------------------

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_request_id UUID REFERENCES payment_requests(id) ON DELETE RESTRICT,
    payment_type VARCHAR(20) NOT NULL DEFAULT 'COLLECTION',
    payment_source VARCHAR(20) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(25) NOT NULL DEFAULT 'PENDING_CONFIRMATION',
    registered_by UUID REFERENCES users(id) ON DELETE RESTRICT,
    confirmed_by UUID REFERENCES users(id) ON DELETE RESTRICT,
    external_reference VARCHAR(200),
    payment_method VARCHAR(30),
    settlement_item_id UUID,
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_payments_type CHECK (payment_type IN ('COLLECTION', 'REFUND')),
    CONSTRAINT ck_payments_source CHECK (payment_source IN ('PEY', 'EXTERNAL')),
    CONSTRAINT ck_payments_amount CHECK (amount > 0),
    CONSTRAINT ck_payments_status
        CHECK (status IN ('PENDING_CONFIRMATION', 'CONFIRMED', 'REJECTED', 'DISCREPANCY'))
);

CREATE TABLE payment_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
    obligation_detail_id UUID REFERENCES obligation_details(id) ON DELETE RESTRICT,
    penalty_id UUID REFERENCES penalties(id) ON DELETE RESTRICT,
    amount NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_payment_allocations_target CHECK (
        (obligation_detail_id IS NOT NULL AND penalty_id IS NULL)
        OR
        (obligation_detail_id IS NULL AND penalty_id IS NOT NULL)
    ),
    CONSTRAINT ck_payment_allocations_amount CHECK (amount > 0)
);

CREATE TABLE pey_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES payments(id) ON DELETE RESTRICT,
    payment_attempt_id UUID NOT NULL REFERENCES payment_attempts(id) ON DELETE RESTRICT,
    transaction_id VARCHAR(160) NOT NULL,
    bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE RESTRICT,
    amount NUMERIC(12,2) NOT NULL,
    transaction_status VARCHAR(30) NOT NULL,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_pey_transactions_transaction UNIQUE (transaction_id),
    CONSTRAINT uq_pey_transactions_attempt UNIQUE (payment_attempt_id),
    CONSTRAINT ck_pey_transactions_amount CHECK (amount > 0)
);

CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id VARCHAR(200) NOT NULL,
    event_type VARCHAR(160) NOT NULL,
    transaction_id VARCHAR(160),
    payload JSONB NOT NULL,
    signature_valid BOOLEAN NOT NULL,
    processing_status VARCHAR(20) NOT NULL DEFAULT 'RECEIVED',
    received_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMPTZ,
    CONSTRAINT uq_webhook_events_webhook_id UNIQUE (webhook_id),
    CONSTRAINT ck_webhook_events_processing_status
        CHECK (processing_status IN ('RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED', 'IGNORED'))
);

-- ---------------------------------------------------------------------------
-- 6. Incidencias, cancelación, liquidación, notificaciones y auditoría
-- ---------------------------------------------------------------------------

CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tanda_id UUID NOT NULL REFERENCES tandas(id) ON DELETE RESTRICT,
    reported_by UUID REFERENCES users(id) ON DELETE RESTRICT,
    category VARCHAR(30) NOT NULL,
    description TEXT NOT NULL,
    related_entity_type VARCHAR(80),
    related_entity_id UUID,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    resolution TEXT,
    resolved_by UUID REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    CONSTRAINT ck_incidents_category
        CHECK (category IN ('PAYMENT_DISCREPANCY', 'PARTICIPANT', 'OPERATIONAL', 'OTHER')),
    CONSTRAINT ck_incidents_status
        CHECK (status IN ('OPEN', 'IN_REVIEW', 'RESOLVED', 'CLOSED'))
);

CREATE TABLE cancellation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tanda_id UUID NOT NULL REFERENCES tandas(id) ON DELETE RESTRICT,
    requested_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    CONSTRAINT ck_cancellation_requests_status
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

CREATE TABLE cancellation_acceptances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cancellation_request_id UUID NOT NULL REFERENCES cancellation_requests(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    accepted BOOLEAN NOT NULL,
    responded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_cancellation_acceptances_user
        UNIQUE (cancellation_request_id, user_id)
);

CREATE TABLE settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tanda_id UUID NOT NULL REFERENCES tandas(id) ON DELETE RESTRICT,
    cancellation_request_id UUID REFERENCES cancellation_requests(id) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL DEFAULT 'CALCULATING',
    calculated_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_settlements_status
        CHECK (status IN ('CALCULATING', 'PENDING_REVIEW', 'IN_PROGRESS', 'COMPLETED'))
);

CREATE TABLE settlement_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settlement_id UUID NOT NULL REFERENCES settlements(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    net_amount NUMERIC(12,2) NOT NULL,
    direction VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_settlement_items_user UNIQUE (settlement_id, user_id),
    CONSTRAINT ck_settlement_items_direction CHECK (direction IN ('RECEIVE', 'PAY')),
    CONSTRAINT ck_settlement_items_status CHECK (status IN ('PENDING', 'IN_PROGRESS', 'SETTLED'))
);

ALTER TABLE payments
    ADD CONSTRAINT fk_payments_settlement_item
    FOREIGN KEY (settlement_item_id) REFERENCES settlement_items(id) ON DELETE RESTRICT;

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    tanda_id UUID REFERENCES tandas(id) ON DELETE RESTRICT,
    title VARCHAR(160) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(60) NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    tanda_id UUID REFERENCES tandas(id) ON DELETE RESTRICT,
    action VARCHAR(120) NOT NULL,
    entity_type VARCHAR(80) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- 7. Índices para FK y consultas habituales
-- ---------------------------------------------------------------------------

CREATE INDEX idx_user_bank_accounts_bank_account ON user_bank_accounts(bank_account_id);
CREATE INDEX idx_tandas_organizer ON tandas(organizer_user_id);
CREATE INDEX idx_participation_requests_tanda_status ON participation_requests(tanda_id, status);
CREATE INDEX idx_participation_requests_user ON participation_requests(user_id);
CREATE INDEX idx_participations_tanda_status ON participations(tanda_id, status);
CREATE INDEX idx_participations_user ON participations(user_id);
CREATE INDEX idx_agreements_tanda ON agreements(tanda_id);
CREATE INDEX idx_agreement_acceptances_participation ON agreement_acceptances(participation_id);
CREATE INDEX idx_turns_tanda_status_date ON turns(tanda_id, status, scheduled_date);
CREATE INDEX idx_turns_receiver ON turns(receiver_participation_id);
CREATE INDEX idx_turn_reservations_participation ON turn_reservations(participation_id);
CREATE INDEX idx_turn_assignment_history_turn ON turn_assignment_history(turn_id, created_at);
CREATE INDEX idx_turn_schedule_history_turn ON turn_schedule_history(turn_id, created_at);
CREATE INDEX idx_payment_obligations_user_status ON payment_obligations(user_id, status);
CREATE INDEX idx_obligation_details_turn ON obligation_details(turn_id);
CREATE INDEX idx_obligation_details_due_status ON obligation_details(due_at, status);
CREATE INDEX idx_payment_requests_obligation ON payment_requests(payment_obligation_id);
CREATE INDEX idx_payment_requests_account_status ON payment_requests(bank_account_id, status);
CREATE INDEX idx_payment_request_items_request ON payment_request_items(payment_request_id);
CREATE INDEX idx_payment_request_items_obligation_detail ON payment_request_items(obligation_detail_id)
    WHERE obligation_detail_id IS NOT NULL;
CREATE INDEX idx_payment_request_items_penalty ON payment_request_items(penalty_id)
    WHERE penalty_id IS NOT NULL;
CREATE INDEX idx_payment_attempts_request_status ON payment_attempts(payment_request_id, status);
CREATE INDEX idx_penalties_detail_status ON penalties(obligation_detail_id, status);
CREATE INDEX idx_payments_request_status ON payments(payment_request_id, status);
CREATE INDEX idx_payments_registered_by ON payments(registered_by);
CREATE INDEX idx_payment_allocations_payment ON payment_allocations(payment_id);
CREATE INDEX idx_payment_allocations_obligation_detail ON payment_allocations(obligation_detail_id)
    WHERE obligation_detail_id IS NOT NULL;
CREATE INDEX idx_payment_allocations_penalty ON payment_allocations(penalty_id)
    WHERE penalty_id IS NOT NULL;
CREATE INDEX idx_pey_transactions_payment ON pey_transactions(payment_id);
CREATE INDEX idx_pey_transactions_attempt ON pey_transactions(payment_attempt_id);
CREATE INDEX idx_webhook_events_transaction ON webhook_events(transaction_id);
CREATE INDEX idx_webhook_events_status_received ON webhook_events(processing_status, received_at);
CREATE INDEX idx_incidents_tanda_status ON incidents(tanda_id, status);
CREATE INDEX idx_cancellation_requests_tanda_status ON cancellation_requests(tanda_id, status);
CREATE INDEX idx_cancellation_acceptances_user ON cancellation_acceptances(user_id);
CREATE INDEX idx_settlements_tanda_status ON settlements(tanda_id, status);
CREATE INDEX idx_settlement_items_user_status ON settlement_items(user_id, status);
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, created_at DESC)
    WHERE read_at IS NULL;
CREATE INDEX idx_audit_logs_tanda_created ON audit_logs(tanda_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- Fin de V1. Las reglas que requieren validar varias filas se implementan
-- en servicios Spring Boot dentro de transacciones.
