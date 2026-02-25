import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRatingDto {
  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}
