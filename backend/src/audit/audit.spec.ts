import { Prisma } from '@prisma/client';
import { appendAudit } from './audit';

describe('audit payload privacy allowlist', () => {
  it.each([
    ['CHECKIN_VOIDED', { voidedProgress: 70, resultingGoalProgress: 40 }],
    ['CHECKIN_CREATED', { progress: 70 }],
  ] as const)(
    '%s keeps only its unambiguous fields',
    async (action, values) => {
      const create = jest.fn().mockResolvedValue({});
      const tx = {
        auditEvent: { create },
      } as unknown as Prisma.TransactionClient;
      await appendAudit(tx, 'owner', action, 'CHECK_IN', 'check', {
        goalId: 'goal',
        goalTitle: 'Lectura',
        progress: 999,
        voidedProgress: 999,
        resultingGoalProgress: 999,
        ...values,
        notes: 'PRIVATE_NOTE',
        passwordHash: 'PRIVATE_HASH',
        JWT: 'PRIVATE_TOKEN',
      });
      expect(create).toHaveBeenCalledWith({
        data: {
          ownerId: 'owner',
          actorId: 'owner',
          action,
          entityType: 'CHECK_IN',
          entityId: 'check',
          payload: { goalId: 'goal', goalTitle: 'Lectura', ...values },
        },
      });
    },
  );
});
