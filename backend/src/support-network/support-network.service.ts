import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, SupportRelationship } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { appendAudit } from '../audit/audit';
import { goalAnalytics } from '../analytics/analytics.rules';
import {
  CreateSupportDto,
  SupportPermissionsDto,
  UpdateSupportDto,
} from './support.dto';
import { personSelect, SupportAccessService } from './support-access.service';

const relationInclude = { supporter: { select: personSelect } } as const;
const goalSelect = {
  id: true,
  title: true,
  description: true,
  category: true,
  status: true,
  progress: true,
  targetDate: true,
} as const;
export function assertPermissions(
  p: Pick<
    SupportRelationship,
    'canViewGoals' | 'canViewProgress' | 'canViewSummaries'
  >,
) {
  if (!p.canViewGoals)
    throw new BadRequestException(
      'Debes permitir objetivos; progreso y resúmenes requieren ese permiso',
    );
}
@Injectable()
export class SupportNetworkService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: SupportAccessService,
  ) {}
  async create(ownerId: string, dto: CreateSupportDto) {
    assertPermissions(dto);
    try {
      return await this.prisma.$transaction(async (tx) => {
        const supporter = await tx.user.findUnique({
          where: { email: dto.supporterEmail },
          select: personSelect,
        });
        if (!supporter) throw new NotFoundException('Cuenta no encontrada');
        if (supporter.id === ownerId)
          throw new BadRequestException('No puedes agregarte a tu propia red');
        const relationship = await tx.supportRelationship.create({
          data: {
            ownerId,
            supporterId: supporter.id,
            canViewGoals: dto.canViewGoals,
            canViewProgress: dto.canViewProgress,
            canViewSummaries: dto.canViewSummaries,
            expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
          },
          include: relationInclude,
        });
        await appendAudit(
          tx,
          ownerId,
          'SUPPORT_RELATIONSHIP_CREATED',
          'SUPPORT_RELATIONSHIP',
          relationship.id,
          this.payload(relationship),
        );
        return relationship;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ConflictException('La relación ya existe; utiliza reactivar');
      throw error;
    }
  }
  list(ownerId: string) {
    return this.prisma.supportRelationship.findMany({
      where: { ownerId },
      include: relationInclude,
      orderBy: [{ authorizedAt: 'desc' }, { id: 'desc' }],
    });
  }
  async detail(ownerId: string, id: string) {
    const row = await this.prisma.supportRelationship.findFirst({
      where: { ownerId, id },
      include: relationInclude,
    });
    if (!row) throw new NotFoundException('Relación no encontrada');
    return row;
  }
  private async lock(
    tx: Prisma.TransactionClient,
    ownerId: string,
    id: string,
  ) {
    const rows = await tx.$queryRaw<
      { id: string }[]
    >`SELECT "id" FROM "SupportRelationship" WHERE "id" = ${id}::uuid AND "ownerId" = ${ownerId}::uuid FOR UPDATE`;
    if (!rows.length) throw new NotFoundException('Relación no encontrada');
    return tx.supportRelationship.findUniqueOrThrow({
      where: { id },
      include: relationInclude,
    });
  }
  private payload(
    row: SupportRelationship & { supporter: { displayName: string } },
  ) {
    return {
      supporterName: row.supporter.displayName,
      canViewGoals: row.canViewGoals,
      canViewProgress: row.canViewProgress,
      canViewSummaries: row.canViewSummaries,
      expiresAt: row.expiresAt?.toISOString() ?? null,
    };
  }
  update(ownerId: string, id: string, dto: UpdateSupportDto) {
    return this.prisma.$transaction(async (tx) => {
      const previous = await this.lock(tx, ownerId, id);
      const permissions = {
        canViewGoals: dto.canViewGoals ?? previous.canViewGoals,
        canViewProgress: dto.canViewProgress ?? previous.canViewProgress,
        canViewSummaries: dto.canViewSummaries ?? previous.canViewSummaries,
      };
      assertPermissions(permissions);
      const row = await tx.supportRelationship.update({
        where: { id },
        data: {
          ...permissions,
          expiresAt:
            dto.expiresAt === undefined
              ? undefined
              : dto.expiresAt === null
                ? null
                : new Date(dto.expiresAt),
        },
        include: relationInclude,
      });
      if (
        previous.canViewGoals !== row.canViewGoals ||
        previous.canViewProgress !== row.canViewProgress ||
        previous.canViewSummaries !== row.canViewSummaries
      )
        await appendAudit(
          tx,
          ownerId,
          'SUPPORT_PERMISSIONS_UPDATED',
          'SUPPORT_RELATIONSHIP',
          id,
          this.payload(row),
        );
      if (previous.expiresAt?.getTime() !== row.expiresAt?.getTime())
        await appendAudit(
          tx,
          ownerId,
          'SUPPORT_EXPIRATION_UPDATED',
          'SUPPORT_RELATIONSHIP',
          id,
          this.payload(row),
        );
      return row;
    });
  }
  revoke(ownerId: string, id: string) {
    return this.prisma.$transaction(async (tx) => {
      const previous = await this.lock(tx, ownerId, id);
      if (previous.revokedAt) return previous; // Idempotent; no fictitious state change.
      const row = await tx.supportRelationship.update({
        where: { id },
        data: { revokedAt: new Date() },
        include: relationInclude,
      });
      await appendAudit(
        tx,
        ownerId,
        'SUPPORT_RELATIONSHIP_REVOKED',
        'SUPPORT_RELATIONSHIP',
        id,
        this.payload(row),
      );
      return row;
    });
  }
  reactivate(ownerId: string, id: string, dto: SupportPermissionsDto) {
    assertPermissions(dto);
    return this.prisma.$transaction(async (tx) => {
      const previous = await this.lock(tx, ownerId, id);
      if (
        !previous.revokedAt &&
        (!previous.expiresAt || previous.expiresAt.getTime() > Date.now())
      )
        throw new ConflictException('La relación ya está activa');
      const expiresAt =
        dto.expiresAt === undefined
          ? previous.expiresAt
          : dto.expiresAt
            ? new Date(dto.expiresAt)
            : null;
      if (expiresAt && expiresAt.getTime() <= Date.now())
        throw new BadRequestException(
          'Para reactivar, selecciona una expiración futura o sin expiración',
        );
      const row = await tx.supportRelationship.update({
        where: { id },
        data: {
          revokedAt: null,
          canViewGoals: dto.canViewGoals,
          canViewProgress: dto.canViewProgress,
          canViewSummaries: dto.canViewSummaries,
          expiresAt,
        },
        include: relationInclude,
      });
      await appendAudit(
        tx,
        ownerId,
        'SUPPORT_RELATIONSHIP_REACTIVATED',
        'SUPPORT_RELATIONSHIP',
        id,
        this.payload(row),
      );
      return row;
    });
  }
  owners(supporterId: string) {
    return this.access.owners(supporterId);
  }
  goals(supporterId: string, ownerId: string) {
    return this.access.read(supporterId, ownerId, 'canViewGoals', (tx) =>
      tx.goal.findMany({
        where: { ownerId },
        select: goalSelect,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      }),
    );
  }
  goal(supporterId: string, ownerId: string, id: string) {
    return this.access.read(
      supporterId,
      ownerId,
      'canViewGoals',
      async (tx) => {
        const goal = await tx.goal.findFirst({
          where: { id, ownerId },
          select: goalSelect,
        });
        if (!goal) throw new NotFoundException('Objetivo no encontrado');
        return goal;
      },
    );
  }
  progress(supporterId: string, ownerId: string, id: string) {
    return this.access.read(
      supporterId,
      ownerId,
      'canViewProgress',
      async (tx) => {
        const goal = await tx.goal.findFirst({
          where: { id, ownerId },
          select: {
            id: true,
            status: true,
            progress: true,
            checkIns: {
              where: { voidedAt: null },
              select: {
                createdAt: true,
                progress: true,
                difficulty: true,
                completion: true,
              },
              orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
            },
          },
        });
        if (!goal) throw new NotFoundException('Objetivo no encontrado');
        return {
          ...goalAnalytics(goal, new Date()),
          timeline: goal.checkIns.map((c) => ({
            date: c.createdAt.toISOString(),
            progress: c.progress,
            difficulty: c.difficulty,
            completion: c.completion,
          })),
        };
      },
    );
  }
  summaries(supporterId: string, ownerId: string) {
    // No productive summaries exist in this increment; permission boundary is real.
    return this.access.read(
      supporterId,
      ownerId,
      'canViewSummaries',
      async () => [],
    );
  }
}
