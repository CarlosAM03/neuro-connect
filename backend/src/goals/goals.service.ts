import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto, UpdateGoalDto } from './goal.dto';
import { assertTransition, lockOwnedGoal } from './goal.policy';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}
  create(ownerId: string, dto: CreateGoalDto) {
    return this.prisma.goal.create({
      data: {
        ownerId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : null,
      },
    });
  }
  list(ownerId: string) {
    return this.prisma.goal.findMany({
      where: { ownerId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
  }
  async detail(ownerId: string, id: string) {
    const goal = await this.prisma.goal.findFirst({ where: { id, ownerId } });
    if (!goal) throw new NotFoundException('Objetivo no encontrado');
    return goal;
  }
  update(ownerId: string, id: string, dto: UpdateGoalDto) {
    return this.prisma.$transaction(async (tx) => {
      const goal = await lockOwnedGoal(tx, ownerId, id);
      if (dto.status !== undefined) assertTransition(goal.status, dto.status);
      return tx.goal.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          category: dto.category,
          targetDate:
            dto.targetDate === undefined
              ? undefined
              : dto.targetDate === null
                ? null
                : new Date(dto.targetDate),
          status: dto.status,
        },
      });
    });
  }
  async delete(ownerId: string, id: string) {
    await this.prisma.$transaction(async (tx) => {
      await lockOwnedGoal(tx, ownerId, id);
      await tx.goal.delete({ where: { id } });
    });
  }
}
