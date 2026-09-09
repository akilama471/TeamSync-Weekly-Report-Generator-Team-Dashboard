import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project name is required' })
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
