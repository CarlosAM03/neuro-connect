import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type SupportPermission =
  'canViewGoals' | 'canViewProgress' | 'canViewSummaries';
export const personSelect = { id: true, displayName: true } as const;
@Injectable()
export class SupportAccessService {
  constructor(private readonly prisma: PrismaService) {}
  owners(supporterId: string) {
    return this.prisma.supportRelationship.findMany({
      where: {
        supporterId,
        revokedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      select: {
        id: true,
        owner: { select: personSelect },
        canViewGoals: true,
        canViewProgress: true,
        canViewSummaries: true,
        expiresAt: true,
      },
      orderBy: { authorizedAt: 'desc' },
    });
  }
  read<T>(
    supporterId: string,
    ownerId: string,
    permission: SupportPermission,
    project: (tx: Prisma.TransactionClient) => Promise<T>,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // A shared row lock prevents permissions changing halfway through a read.
      // Revoke/permission writes acquire FOR UPDATE and affect the next request.
      await tx.$queryRaw`SELECT "id" FROM "SupportRelationship" WHERE "ownerId" = ${ownerId}::uuid AND "supporterId" = ${supporterId}::uuid FOR SHARE`;
      const relationship = await tx.supportRelationship.findUnique({
        where: { ownerId_supporterId: { ownerId, supporterId } },
      });
      if (
        !relationship ||
        relationship.revokedAt ||
        (relationship.expiresAt &&
          relationship.expiresAt.getTime() <= Date.now()) ||
        !relationship.canViewGoals ||
        !relationship[permission]
      )
        throw new NotFoundException('Información compartida no disponible');
      return project(tx);
    });
  }
}
