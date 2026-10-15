import { AuditAction, AuditEntityType, Prisma } from '@prisma/client';

// Explicit allowlist per action. Neither requests nor domain rows are serialized.
const allowed: Record<AuditAction, readonly string[]> = {
  ACCOUNT_REGISTERED: [],
  PROFILE_UPDATED: ['changedFields'],
  GOAL_CREATED: ['title'],
  GOAL_UPDATED: ['title', 'changedFields'],
  GOAL_STATUS_CHANGED: ['title', 'previousStatus', 'newStatus'],
  GOAL_CANCELLED: ['title', 'previousStatus', 'newStatus'],
  GOAL_REACTIVATED: ['title', 'previousStatus', 'newStatus'],
  CHECKIN_CREATED: ['goalId', 'goalTitle', 'progress'],
  CHECKIN_VOIDED: [
    'goalId',
    'goalTitle',
    'voidedProgress',
    'resultingGoalProgress',
  ],
  SUPPORT_RELATIONSHIP_CREATED: [
    'supporterName',
    'canViewGoals',
    'canViewProgress',
    'canViewSummaries',
    'expiresAt',
  ],
  SUPPORT_PERMISSIONS_UPDATED: [
    'supporterName',
    'canViewGoals',
    'canViewProgress',
    'canViewSummaries',
  ],
  SUPPORT_RELATIONSHIP_REVOKED: ['supporterName'],
  SUPPORT_RELATIONSHIP_REACTIVATED: [
    'supporterName',
    'canViewGoals',
    'canViewProgress',
    'canViewSummaries',
    'expiresAt',
  ],
  SUPPORT_EXPIRATION_UPDATED: ['supporterName', 'expiresAt'],
};
export function appendAudit(
  tx: Prisma.TransactionClient,
  ownerId: string,
  action: AuditAction,
  entityType: AuditEntityType,
  entityId: string,
  input: Prisma.InputJsonObject = {},
) {
  const payload: Record<string, Prisma.InputJsonValue | null> = {};
  for (const key of allowed[action]) {
    if (input[key] !== undefined) payload[key] = input[key];
  }
  return tx.auditEvent.create({
    data: { ownerId, actorId: ownerId, action, entityType, entityId, payload },
  });
}
