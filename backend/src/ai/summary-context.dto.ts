import { ApiProperty } from '@nestjs/swagger';
import { GoalStatus } from '@prisma/client';
import { OverviewResponse } from '../analytics/analytics.dto';
import { Trend } from '../analytics/analytics.rules';

export class GoalSummaryContext {
  @ApiProperty() title!: string;
  @ApiProperty({ enum: GoalStatus }) status!: GoalStatus;
  @ApiProperty({ minimum: 0, maximum: 100 }) progress!: number;
  @ApiProperty({ enum: ['PROGRESSING', 'STABLE', 'DECLINING', 'INACTIVE'] })
  trend!: Trend;
  @ApiProperty({ type: Number, nullable: true }) averageDifficulty!:
    number | null;
  @ApiProperty({ type: Number, nullable: true }) daysSinceLastCheckIn!:
    number | null;
  @ApiProperty() insufficientHistory!: boolean;
}
export class SummaryContext extends OverviewResponse {
  @ApiProperty({ enum: [28], example: 28 }) periodDays!: 28;
  @ApiProperty({ type: [GoalSummaryContext] }) goals!: GoalSummaryContext[];
}
export class AiPreviewResponse {
  @ApiProperty({ type: SummaryContext }) context!: SummaryContext;
  @ApiProperty({
    description:
      'Vendor-neutral SYSTEM and USER prompt. Technical preview only; no generation or network call.',
  })
  prompt!: string;
  @ApiProperty({ enum: [false], example: false }) providerConfigured!: false;
}
