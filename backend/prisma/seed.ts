import 'dotenv/config';
import {
  AuditAction,
  AuditEntityType,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import * as argon2 from 'argon2';
// Synthetic seed events use explicit values only; no historical backfill.
function appendAudit(
  tx: Prisma.TransactionClient,
  ownerId: string,
  action: AuditAction,
  entityType: AuditEntityType,
  entityId: string,
  payload: Prisma.InputJsonObject = {},
) {
  return tx.auditEvent.create({
    data: { ownerId, actorId: ownerId, action, entityType, entityId, payload },
  });
}
const prisma = new PrismaClient();
async function seed() {
  if (process.env.NODE_ENV === 'production')
    throw new Error('Demo seed is disabled in production');
  const password = process.env.SEED_PASSWORD;
  if (!password || password.length < 8)
    throw new Error('Set SEED_PASSWORD (8+ characters) locally');
  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
  const day = 86400000;
  const anchor = new Date();
  anchor.setUTCHours(12, 0, 0, 0);
  const cases = [
    {
      title: 'Organizar las entregas',
      values: [10, 20, 35, 45, 60],
      days: [27, 20, 13, 6, 1],
    },
    {
      title: 'Mantener mi agenda',
      values: [45, 46, 45, 46, 47],
      days: [27, 20, 13, 6, 1],
    },
    {
      title: 'Retomar la lectura',
      values: [10, 20, 25, 30, 35],
      days: [42, 35, 28, 21, 14],
    },
    {
      title: 'Preparar material de estudio',
      values: [20, 40, 60, 80, 100],
      days: [27, 20, 13, 6, 1],
    },
    {
      title: 'Explorar otra rutina',
      values: [10, 20, 25, 30, 35],
      days: [42, 35, 28, 21, 14],
    },
  ];
  await prisma.$transaction(async (tx) => {
    const existingOwner = await tx.user.findUnique({
      where: { email: 'demo@neuroconnect.local' },
    });
    const owner = await tx.user.upsert({
      where: { email: 'demo@neuroconnect.local' },
      create: {
        email: 'demo@neuroconnect.local',
        displayName: 'Cuenta de demostración',
        passwordHash,
      },
      update: { passwordHash },
    });
    if (!existingOwner)
      await appendAudit(tx, owner.id, 'ACCOUNT_REGISTERED', 'USER', owner.id);
    const supporters = [];
    for (const [email, displayName] of [
      ['supporter@neuroconnect.local', 'Apoyo de demostración'],
      ['supporter-goals@neuroconnect.local', 'Apoyo solo objetivos'],
    ]) {
      const previous = await tx.user.findUnique({ where: { email } });
      const user = await tx.user.upsert({
        where: { email },
        create: { email, displayName, passwordHash },
        update: { passwordHash },
      });
      if (!previous)
        await appendAudit(tx, user.id, 'ACCOUNT_REGISTERED', 'USER', user.id);
      supporters.push(user);
    }
    for (let g = 0; g < cases.length; g++) {
      const item = cases[g];
      const id = `00000000-0000-4000-8000-${String(g + 1).padStart(12, '0')}`;
      const existing = await tx.goal.findUnique({ where: { id } });
      if (existing && existing.ownerId !== owner.id)
        throw new Error('Seed ID collision; no changes applied');
      // Existing demo history (including owner changes) is never reset or erased.
      if (existing) continue;
      const goal = await tx.goal.create({
        data: {
          id,
          ownerId: owner.id,
          title: item.title,
          category: 'Demostración',
        },
      });
      await appendAudit(tx, owner.id, 'GOAL_CREATED', 'GOAL', id, {
        title: item.title,
      });
      for (let i = 0; i < item.values.length; i++) {
        const checkIn = await tx.checkIn.create({
          data: {
            id: `00000000-0000-4000-9000-${String(g * 10 + i + 1).padStart(12, '0')}`,
            goalId: id,
            progress: item.values[i],
            difficulty: 2 + (i % 3),
            completion: i === 4 ? 'MET' : 'PARTIAL',
            notes: 'Registro sintético de demostración',
            createdAt: new Date(anchor.getTime() - item.days[i] * day),
          },
        });
        await appendAudit(
          tx,
          owner.id,
          'CHECKIN_CREATED',
          'CHECK_IN',
          checkIn.id,
          { goalId: id, goalTitle: goal.title, progress: checkIn.progress },
        );
      }
      const status = g === 3 ? 'COMPLETED' : g === 4 ? 'CANCELLED' : 'ACTIVE';
      await tx.goal.update({
        where: { id },
        data: { status, progress: item.values[4] },
      });
      if (status !== 'ACTIVE')
        await appendAudit(
          tx,
          owner.id,
          status === 'CANCELLED' ? 'GOAL_CANCELLED' : 'GOAL_STATUS_CHANGED',
          'GOAL',
          id,
          { title: goal.title, previousStatus: 'ACTIVE', newStatus: status },
        );
    }
    for (const [i, user] of supporters.entries()) {
      const existing = await tx.supportRelationship.findUnique({
        where: {
          ownerId_supporterId: { ownerId: owner.id, supporterId: user.id },
        },
      });
      if (existing) continue;
      const permissions = {
        canViewGoals: true,
        canViewProgress: i === 0,
        canViewSummaries: false,
      };
      const relation = await tx.supportRelationship.create({
        data: { ownerId: owner.id, supporterId: user.id, ...permissions },
      });
      await appendAudit(
        tx,
        owner.id,
        'SUPPORT_RELATIONSHIP_CREATED',
        'SUPPORT_RELATIONSHIP',
        relation.id,
        { supporterName: user.displayName, ...permissions, expiresAt: null },
      );
    }
  });
  console.log(
    'Seed complete: owner + two supporters, five goals, differentiated permissions, atomic audit. Existing history preserved on re-run.',
  );
}
seed()
  .catch(() => {
    console.error(
      'Seed failed; verify local configuration and database availability.',
    );
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
