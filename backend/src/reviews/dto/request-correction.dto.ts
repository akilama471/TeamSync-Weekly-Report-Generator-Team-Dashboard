import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RequestCorrectionDto {
  @IsString()
  @IsNotEmpty({ message: 'A general comment explaining the requested correction is required' })
  @MinLength(5, { message: 'Comment must be at least 5 characters long' })
  comment: string;
}
