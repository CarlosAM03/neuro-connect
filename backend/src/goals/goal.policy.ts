import { ConflictException, NotFoundException } from '@nestjs/common';
import { GoalStatus, Prisma } from '@prisma/client';

export function assertTransition(from: GoalStatus, to: GoalStatus) {
  if (from === to) return;
  const allowed: Record<GoalStatus, GoalStatus[]> = {
    ACTIVE: ['PAUSED', 'COMPLETED', 'CANCELLED'],
    PAUSED: ['ACTIVE', 'CANCELLED'],
    COMPLETED: ['ACTIVE'],
    CANCELLED: ['ACTIVE'],
  };
  if (!allowed[from].includes(to))
    throw new ConflictException('Transición de objetivo no permitida');
}
export function assertActive(status: GoalStatus) {
  if (status !== 'ACTIVE')
    throw new ConflictException(
      'Reactiva el objetivo para registrar nuevos check-ins',
    );
}

// Every mutation of a goal or its history acquires the same parent lock.
// PostgreSQL releases it on commit/rollback, serializing lifecycle and snapshots.
export async function lockOwnedGoal(
  tx: Prisma.TransactionClient,
  ownerId: string,
  id: string,
) {
  const rows = await tx.$queryRaw<
    { id: string }[]
  >`SELECT "id" FROM "Goal" WHERE "id" = ${id}::uuid AND "ownerId" = ${ownerId}::uuid FOR UPDATE`;
  if (!rows.length) throw new NotFoundException('Objetivo no encontrado');
  const goal = await tx.goal.findUnique({ where: { id } });
  if (!goal) throw new NotFoundException('Objetivo no encontrado');
  return goal;
}
