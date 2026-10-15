import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoalsService } from '../goals/goals.service';
import { assertActive, lockOwnedGoal } from '../goals/goal.policy';
import { CreateCheckInDto } from './check-in.dto';
import { appendAudit } from '../audit/audit';

@Injectable()
export class CheckInsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly goals: GoalsService,
  ) {}
  create(ownerId: string, goalId: string, dto: CreateCheckInDto) {
    return this.prisma.$transaction(async (tx) => {
      const goal = await lockOwnedGoal(tx, ownerId, goalId);
      assertActive(goal.status);
      const latest = await tx.checkIn.findFirst({
        where: { goalId },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      });
      // Strictly increasing server timestamps keep the snapshot unambiguous even
      // for concurrent requests within the same millisecond or a clock correction.
      const createdAt = new Date(
        Math.max(Date.now(), (latest?.createdAt.getTime() ?? 0) + 1),
      );
      const checkIn = await tx.checkIn.create({
        data: {
          goalId,
          progress: dto.progress,
          difficulty: dto.difficulty,
          completion: dto.completion,
          notes: dto.notes,
          createdAt,
        },
      });
      await tx.goal.update({
        where: { id: goalId },
        data: { progress: checkIn.progress },
      });
      await appendAudit(
        tx,
        ownerId,
        'CHECKIN_CREATED',
        'CHECK_IN',
        checkIn.id,
        { goalId, goalTitle: goal.title, progress: checkIn.progress },
      );
      return checkIn;
    });
  }
  async history(ownerId: string, goalId: string) {
    await this.goals.detail(ownerId, goalId);
    return this.prisma.checkIn.findMany({
      where: { goalId, goal: { ownerId }, voidedAt: null },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
  }
  async detail(ownerId: string, goalId: string, id: string) {
    const checkIn = await this.prisma.checkIn.findFirst({
      where: { id, goalId, goal: { ownerId } },
    });
    if (!checkIn) throw new NotFoundException('Check-in no encontrado');
    return checkIn;
  }
  async delete(ownerId: string, goalId: string, id: string) {
    await this.prisma.$transaction(async (tx) => {
      const goal = await lockOwnedGoal(tx, ownerId, goalId);
      const result = await tx.checkIn.updateMany({
        where: { id, goalId, voidedAt: null },
        data: { voidedAt: new Date() },
      });
      if (!result.count) throw new NotFoundException('Check-in no encontrado');
      const latest = await tx.checkIn.findFirst({
        where: { goalId, voidedAt: null },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      });
      await tx.goal.update({
        where: { id: goalId },
        data: { progress: latest?.progress ?? 0 },
      });
      await appendAudit(tx, ownerId, 'CHECKIN_VOIDED', 'CHECK_IN', id, {
        goalId,
        goalTitle: goal.title,
        progress: latest?.progress ?? 0,
      });
    });
  }
}
