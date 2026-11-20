import { ApiProperty } from '@nestjs/swagger';
import { AISummaryStatus } from '@prisma/client';

// Shared by owner and delegated reads. Internal snapshots never cross this seam.
export const summaryReadSelect = {
  id: true,
  periodStart: true,
  periodEnd: true,
  content: true,
  status: true,
  createdAt: true,
} as const;

export class SummaryReadResponse {
  @ApiProperty() id!: string;
  @ApiProperty() periodStart!: Date;
  @ApiProperty() periodEnd!: Date;
  @ApiProperty({ type: String, nullable: true }) content!: string | null;
  @ApiProperty({ enum: AISummaryStatus }) status!: AISummaryStatus;
  @ApiProperty() createdAt!: Date;
}
