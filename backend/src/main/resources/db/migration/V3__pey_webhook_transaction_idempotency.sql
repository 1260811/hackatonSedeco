-- Independent idempotency for a Pey transaction even if it arrives
-- through more than one webhook delivery.
CREATE UNIQUE INDEX uq_webhook_events_transaction_id
    ON webhook_events(transaction_id)
    WHERE transaction_id IS NOT NULL;
