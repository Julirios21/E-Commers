import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity.js';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
