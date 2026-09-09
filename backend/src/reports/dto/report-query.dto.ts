import { IsOptional, IsString, IsInt, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ReportStatus } from '@prisma/client';

export class ReportQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  projectId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsString()
  weekStart?: string;
}
