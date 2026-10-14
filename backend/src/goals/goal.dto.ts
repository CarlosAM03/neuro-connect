import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { GoalStatus } from '@prisma/client';
import { trimText } from '../auth/auth.dto';

export class CreateGoalDto {
  @ApiProperty({ minLength: 1, maxLength: 200 })
  @Transform(trimText)
  @IsString()
  @Length(1, 200)
  title!: string;
  @ApiPropertyOptional({ nullable: true, maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string | null;
  @ApiPropertyOptional({ nullable: true, maxLength: 100 })
  @IsOptional()
  @Transform(trimText)
  @IsString()
  @MaxLength(100)
  category?: string | null;
  @ApiPropertyOptional({ nullable: true, format: 'date-time' })
  @IsOptional()
  @IsDateString({ strict: true })
  targetDate?: string | null;
}
export class UpdateGoalDto extends PartialType(CreateGoalDto, {
  skipNullProperties: false,
}) {
  @ApiPropertyOptional({ enum: GoalStatus })
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsEnum(GoalStatus)
  status?: GoalStatus;
}
