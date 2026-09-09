import {
  IsOptional,
  IsInt,
  IsDateString,
  IsArray,
  ValidateNested,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  TaskItemDto,
  NextTaskItemDto,
  BlockerItemDto,
  AchievementItemDto,
  HourItemDto,
  LinkItemDto,
} from './create-report.dto';

export class UpdateReportDto {
  @IsOptional()
  @IsInt()
  projectId?: number;

  @IsOptional()
  @IsDateString()
  weekStart?: string;

  @IsOptional()
  @IsDateString()
  weekEnd?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  links?: LinkItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskItemDto)
  tasks?: TaskItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NextTaskItemDto)
  nextTasks?: NextTaskItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlockerItemDto)
  blockers?: BlockerItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AchievementItemDto)
  achievements?: AchievementItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HourItemDto)
  hours?: HourItemDto[];

  @IsOptional()
  @IsBoolean()
  submitImmediately?: boolean;
}
