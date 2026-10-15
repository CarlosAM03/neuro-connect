import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class SupportPermissionsDto {
  @ApiProperty() @IsBoolean() canViewGoals!: boolean;
  @ApiProperty() @IsBoolean() canViewProgress!: boolean;
  @ApiProperty() @IsBoolean() canViewSummaries!: boolean;
  @ApiPropertyOptional({
    nullable: true,
    format: 'date-time',
    description: 'Null means no expiry; evaluated on every request.',
  })
  @IsOptional()
  @IsDateString({ strict: true })
  expiresAt?: string | null;
}
export class CreateSupportDto extends SupportPermissionsDto {
  @ApiProperty({ format: 'email' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  supporterEmail!: string;
}
export class UpdateSupportDto extends PartialType(SupportPermissionsDto, {
  skipNullProperties: false,
}) {
  @ValidateIf((_o, v: unknown) => v !== undefined)
  @IsBoolean()
  declare canViewGoals: boolean;
  @ValidateIf((_o, v: unknown) => v !== undefined)
  @IsBoolean()
  declare canViewProgress: boolean;
  @ValidateIf((_o, v: unknown) => v !== undefined)
  @IsBoolean()
  declare canViewSummaries: boolean;
}
export class SupportPersonResponse {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty() displayName!: string;
}
export class SupportRelationshipResponse {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ format: 'uuid' }) ownerId!: string;
  @ApiProperty({ format: 'uuid' }) supporterId!: string;
  @ApiProperty() canViewGoals!: boolean;
  @ApiProperty() canViewProgress!: boolean;
  @ApiProperty() canViewSummaries!: boolean;
  @ApiProperty({ format: 'date-time' }) authorizedAt!: string;
  @ApiProperty({ nullable: true, type: String, format: 'date-time' })
  expiresAt!: string | null;
  @ApiProperty({ nullable: true, type: String, format: 'date-time' })
  revokedAt!: string | null;
  @ApiProperty({ type: SupportPersonResponse })
  supporter!: SupportPersonResponse;
}
