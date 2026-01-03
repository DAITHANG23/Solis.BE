import { ApiProperty } from '@nestjs/swagger';

export class SignoutResponseDto {
  @ApiProperty()
  message: string;
}
