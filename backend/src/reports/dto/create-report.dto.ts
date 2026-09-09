import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsDateString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class TaskItemDto {
  @IsString()
  @IsNotEmpty()
  taskName: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.MEDIUM;

  @IsInt()
  @Min(0)
  @Max(100)
  plannedPercent: number;

  @IsInt()
  @Min(0)
  @Max(100)
  actualPercent: number;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsNumber()
  @Min(0)
  plannedHours: number;

  @IsNumber()
  @Min(0)
  spentHours: number;

  @IsOptional()
  @IsString()
  deliverable?: string;
}

export class NextTaskItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.MEDIUM;

  @IsOptional()
  @IsNumber()
  @Min(0)
  plannedHours?: number;
}

export class BlockerItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  impact?: string;

  @IsBoolean()
  @IsOptional()
  isKeyIssue?: boolean = false;
}

export class AchievementItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsOptional()
  isKeyAchievement?: boolean = false;
}

export class HourItemDto {
  @IsString()
  @IsNotEmpty()
  taskType: string;

  @IsNumber()
  @Min(0)
  hours: number;
}

export class LinkItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateReportDto {
  @IsInt()
  projectId: number;

  @IsDateString()
  weekStart: string;

  @IsDateString()
  weekEnd: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  links?: LinkItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskItemDto)
  tasks: TaskItemDto[];

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
  submitImmediately?: boolean = false;
}
