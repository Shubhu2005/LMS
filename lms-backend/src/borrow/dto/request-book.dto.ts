import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestBookDto {
  @ApiProperty({ example: '65f2b2a7d91c3c1234567890' })
  @IsMongoId()
  bookId: string;
}
