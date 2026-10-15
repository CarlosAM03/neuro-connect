-- ADR-008: additive migration; existing history remains unchanged.
ALTER TYPE "GoalStatus" ADD VALUE 'CANCELLED';
ALTER TABLE "CheckIn" ADD COLUMN "voidedAt" TIMESTAMPTZ(3);

CREATE TYPE "AuditEntityType" AS ENUM ('USER', 'GOAL', 'CHECK_IN', 'SUPPORT_RELATIONSHIP');
CREATE TYPE "AuditAction" AS ENUM (
  'ACCOUNT_REGISTERED', 'PROFILE_UPDATED', 'GOAL_CREATED', 'GOAL_UPDATED',
  'GOAL_STATUS_CHANGED', 'GOAL_CANCELLED', 'GOAL_REACTIVATED',
  'CHECKIN_CREATED', 'CHECKIN_VOIDED', 'SUPPORT_RELATIONSHIP_CREATED',
  'SUPPORT_PERMISSIONS_UPDATED', 'SUPPORT_RELATIONSHIP_REVOKED',
  'SUPPORT_RELATIONSHIP_REACTIVATED', 'SUPPORT_EXPIRATION_UPDATED'
);
CREATE TABLE "SupportRelationship" (
  "id" UUID NOT NULL PRIMARY KEY,
  "ownerId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "supporterId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "canViewGoals" BOOLEAN NOT NULL,
  "canViewProgress" BOOLEAN NOT NULL,
  "canViewSummaries" BOOLEAN NOT NULL,
  "authorizedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMPTZ(3),
  "revokedAt" TIMESTAMPTZ(3),
  CONSTRAINT "support_not_self" CHECK ("ownerId" <> "supporterId"),
  CONSTRAINT "support_valid_permissions" CHECK ("canViewGoals")
  -- All allowed permission combinations require VIEW_GOALS (including GOALS only).
);
CREATE UNIQUE INDEX "SupportRelationship_ownerId_supporterId_key" ON "SupportRelationship"("ownerId", "supporterId");
CREATE INDEX "SupportRelationship_ownerId_idx" ON "SupportRelationship"("ownerId");
CREATE INDEX "SupportRelationship_supporterId_idx" ON "SupportRelationship"("supporterId");
CREATE TABLE "AuditEvent" (
  "id" UUID NOT NULL PRIMARY KEY,
  "ownerId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "actorId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "action" "AuditAction" NOT NULL,
  "entityType" "AuditEntityType" NOT NULL,
  "entityId" UUID NOT NULL,
  "payload" JSONB NOT NULL,
  "occurredAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "AuditEvent_ownerId_occurredAt_idx" ON "AuditEvent"("ownerId", "occurredAt");
CREATE INDEX "AuditEvent_ownerId_entityType_entityId_idx" ON "AuditEvent"("ownerId", "entityType", "entityId");
-- Normal application services only append; PostgreSQL also rejects any rewrite.
CREATE FUNCTION reject_audit_update() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'AuditEvent is append-only'; END;
$$;
CREATE TRIGGER "AuditEvent_no_update" BEFORE UPDATE ON "AuditEvent"
FOR EACH ROW EXECUTE FUNCTION reject_audit_update();
-- No delete API/service exists. FK cascades remain available solely for controlled
-- internal test fixture cleanup; account deletion is outside the product contract.
