ALTER TABLE webhook_events
    ADD COLUMN attempt_count INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN last_error TEXT;

ALTER TABLE webhook_events
    ADD CONSTRAINT ck_webhook_events_attempt_count CHECK (attempt_count >= 0);

CREATE INDEX idx_webhook_events_retry_queue
    ON webhook_events(processing_status, received_at)
    WHERE processing_status IN ('RECEIVED', 'PROCESSING');
