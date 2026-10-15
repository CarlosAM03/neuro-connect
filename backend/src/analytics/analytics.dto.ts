import { ApiProperty } from '@nestjs/swagger';
export class TimelinePointResponse {
  @ApiProperty({ format: 'date-time' }) date!: string;
  @ApiProperty({ minimum: 0, maximum: 100 }) progress!: number;
}
export class GoalAnalyticsResponse {
  @ApiProperty({ format: 'uuid' }) goalId!: string;
  @ApiProperty() currentProgress!: number;
  @ApiProperty({ type: Number, nullable: true }) previousProgress!:
    number | null;
  @ApiProperty({ type: Number, nullable: true }) progressDelta!: number | null;
  @ApiProperty({ type: Number, nullable: true }) averageDifficulty!:
    number | null;
  @ApiProperty() totalCheckIns!: number;
  @ApiProperty() checkInsLast28Days!: number;
  @ApiProperty({ type: Number, nullable: true }) daysSinceLastCheckIn!:
    number | null;
  @ApiProperty({ enum: ['PROGRESSING', 'STABLE', 'DECLINING', 'INACTIVE'] })
  trend!: string;
  @ApiProperty() insufficientHistory!: boolean;
  @ApiProperty({ type: [TimelinePointResponse] })
  timeline!: TimelinePointResponse[];
}
export class OverviewResponse {
  @ApiProperty() totalGoals!: number;
  @ApiProperty() activeGoals!: number;
  @ApiProperty() pausedGoals!: number;
  @ApiProperty() completedGoals!: number;
  @ApiProperty() cancelledGoals!: number;
  @ApiProperty() completionRate!: number;
  @ApiProperty({
    description:
      'Average progress of ACTIVE, PAUSED and COMPLETED Goals; 0 if none. CANCELLED remains in totalGoals only.',
  })
  averageProgress!: number;
  @ApiProperty() checkInsLast28Days!: number;
  @ApiProperty() checkInFrequencyPerWeek!: number;
  @ApiProperty() inactiveGoals!: number;
}
