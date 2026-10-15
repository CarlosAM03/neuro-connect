-- Reject direct audit deletion too. Nested FK cascades are reserved for internal
-- test cleanup; the product has no account/domain deletion operation.
CREATE OR REPLACE FUNCTION reject_audit_update() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' AND pg_trigger_depth() > 1 THEN RETURN OLD; END IF;
  RAISE EXCEPTION 'AuditEvent is append-only';
END;
$$;
CREATE TRIGGER "AuditEvent_no_delete" BEFORE DELETE ON "AuditEvent"
FOR EACH ROW EXECUTE FUNCTION reject_audit_update();
