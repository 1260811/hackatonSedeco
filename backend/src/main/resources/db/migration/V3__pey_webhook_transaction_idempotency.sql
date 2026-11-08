-- Independent idempotency for a Pey transaction even if it arrives
-- through more than one webhook delivery.
-- IF NOT EXISTS allows startup when the index was created by an earlier
-- schema setup or a previous partial deployment.
CREATE UNIQUE INDEX IF NOT EXISTS uq_webhook_events_transaction_id
    ON webhook_events(transaction_id)
    WHERE transaction_id IS NOT NULL;
