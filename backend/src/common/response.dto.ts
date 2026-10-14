import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CheckInCompletion, GoalStatus } from '@prisma/client';

export class SafeUserResponse {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ format: 'email' }) email!: string;
  @ApiProperty() displayName!: string;
  @ApiProperty({ format: 'date-time' }) createdAt!: string;
  @ApiProperty({ format: 'date-time' }) updatedAt!: string;
}
export class TokenResponse {
  @ApiProperty({ description: 'JWT Bearer access token' }) accessToken!: string;
}
export class GoalResponse {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ format: 'uuid' }) ownerId!: string;
  @ApiProperty() title!: string;
  @ApiPropertyOptional({ nullable: true, type: String }) description!:
    string | null;
  @ApiPropertyOptional({ nullable: true, type: String }) category!:
    string | null;
  @ApiProperty({ enum: GoalStatus }) status!: GoalStatus;
  @ApiProperty({ minimum: 0, maximum: 100 }) progress!: number;
  @ApiPropertyOptional({ nullable: true, type: String, format: 'date-time' })
  targetDate!: string | null;
  @ApiProperty({ format: 'date-time' }) createdAt!: string;
  @ApiProperty({ format: 'date-time' }) updatedAt!: string;
}
export class CheckInResponse {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ format: 'uuid' }) goalId!: string;
  @ApiProperty({ minimum: 0, maximum: 100 }) progress!: number;
  @ApiProperty({ minimum: 1, maximum: 5 }) difficulty!: number;
  @ApiProperty({ enum: CheckInCompletion }) completion!: CheckInCompletion;
  @ApiPropertyOptional({
    nullable: true,
    type: String,
    description: 'Private owner-only note',
  })
  notes!: string | null;
  @ApiProperty({ format: 'date-time' }) createdAt!: string;
}
export class ErrorResponse {
  @ApiProperty() statusCode!: number;
  @ApiProperty() code!: string;
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message!: string | string[];
  @ApiProperty() path!: string;
  @ApiProperty({ format: 'date-time' }) timestamp!: string;
}
