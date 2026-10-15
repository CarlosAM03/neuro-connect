import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { goalAnalytics, overviewAnalytics } from './analytics.rules';

// Projection is also the privacy boundary for future analytics consumers.
const select = {
  id: true,
  status: true,
  progress: true,
  checkIns: {
    where: { voidedAt: null },
    select: { progress: true, difficulty: true, createdAt: true },
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
  },
} satisfies Prisma.GoalSelect;

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}
  // One source snapshot for the privacy boundary; calculations remain here.
  summarySource(ownerId: string) {
    return this.prisma.$transaction(
      async (tx) => {
        const goals = await tx.goal.findMany({
          where: { ownerId },
          select: { ...select, title: true },
          orderBy: { id: 'asc' },
        });
        const now = new Date();
        return {
          overview: overviewAnalytics(goals, now),
          goals: goals.map((goal) => ({
            title: goal.title,
            status: goal.status,
            analytics: goalAnalytics(goal, now),
          })),
        };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
  }
  overview(ownerId: string) {
    return this.prisma.$transaction(
      async (tx) => {
        const now = new Date();
        const goals = await tx.goal.findMany({ where: { ownerId }, select });
        return overviewAnalytics(goals, now);
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
  }
  goal(ownerId: string, id: string) {
    return this.prisma.$transaction(
      async (tx) => {
        const now = new Date();
        const goal = await tx.goal.findFirst({
          where: { id, ownerId },
          select,
        });
        if (!goal) throw new NotFoundException('Objetivo no encontrado');
        return goalAnalytics(goal, now);
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
  }
}
