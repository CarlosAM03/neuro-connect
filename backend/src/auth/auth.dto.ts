import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const trimText = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;
export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  email!: string;
  @ApiProperty({ minLength: 8, maxLength: 128, format: 'password' })
  @IsString()
  @Length(8, 128)
  password!: string;
}
export class RegisterDto extends LoginDto {
  @ApiProperty({ minLength: 1, maxLength: 100 })
  @Transform(trimText)
  @IsString()
  @Length(1, 100)
  displayName!: string;
}
export class UpdateProfileDto {
  @ApiProperty({ minLength: 1, maxLength: 100 })
  @Transform(trimText)
  @IsString()
  @Length(1, 100)
  displayName!: string;
}
