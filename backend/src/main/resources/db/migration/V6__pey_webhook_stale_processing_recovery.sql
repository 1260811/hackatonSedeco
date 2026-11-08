ALTER TABLE webhook_events
    ADD COLUMN processing_started_at TIMESTAMPTZ;

CREATE INDEX idx_webhook_events_stale_processing
    ON webhook_events(processing_started_at)
    WHERE processing_status = 'PROCESSING';
