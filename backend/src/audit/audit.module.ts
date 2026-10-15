import { Controller, Get, Module, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { AuditAction, AuditEntityType } from '@prisma/client';
import { CurrentUser, SafeUser } from '../auth/auth.guard';
import { PrismaService } from '../prisma/prisma.service';

export class AuditQuery {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000000)
  page = 1;
  @ApiPropertyOptional({ default: 30, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 30;
  @ApiPropertyOptional({ enum: AuditAction })
  @IsOptional()
  @IsEnum(AuditAction)
  action?: AuditAction;
  @ApiPropertyOptional({ enum: AuditEntityType })
  @IsOptional()
  @IsEnum(AuditEntityType)
  entityType?: AuditEntityType;
  @ApiPropertyOptional({ format: 'date-time' })
  @IsOptional()
  @IsDateString({ strict: true })
  from?: string;
  @ApiPropertyOptional({ format: 'date-time' })
  @IsOptional()
  @IsDateString({ strict: true })
  to?: string;
}
class AuditEventResponse {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ format: 'uuid' }) ownerId!: string;
  @ApiProperty({ format: 'uuid' }) actorId!: string;
  @ApiProperty({ enum: AuditAction }) action!: AuditAction;
  @ApiProperty({ enum: AuditEntityType }) entityType!: AuditEntityType;
  @ApiProperty({ format: 'uuid' }) entityId!: string;
  @ApiProperty({ type: Object }) payload!: object;
  @ApiProperty({ format: 'date-time' }) occurredAt!: string;
}
class AuditPageResponse {
  @ApiProperty({ type: [AuditEventResponse] }) items!: AuditEventResponse[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
}
@ApiTags('Activity')
@ApiBearerAuth()
@Controller('audit-events')
class AuditController {
  constructor(private readonly prisma: PrismaService) {}
  @Get()
  @ApiOkResponse({
    type: AuditPageResponse,
    description: 'Owner-only activity, newest first. No delegated access.',
  })
  list(@CurrentUser() user: SafeUser, @Query() query: AuditQuery) {
    const where = {
      ownerId: user.id,
      action: query.action,
      entityType: query.entityType,
      occurredAt: {
        gte: query.from ? new Date(query.from) : undefined,
        lte: query.to ? new Date(query.to) : undefined,
      },
    };
    return this.prisma.$transaction(async (tx) => ({
      items: await tx.auditEvent.findMany({
        where,
        orderBy: [{ occurredAt: 'desc' }, { id: 'desc' }],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      total: await tx.auditEvent.count({ where }),
      page: query.page,
      limit: query.limit,
    }));
  }
}
@Module({ controllers: [AuditController] })
export class AuditModule {}
