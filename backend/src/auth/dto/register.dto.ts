import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsInt } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email address format' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  name: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsInt()
  roleId?: number; // 1=TEAM_MEMBER, 2=MANAGER, 3=ADMIN
}
