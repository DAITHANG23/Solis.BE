import { ApiProperty } from '@nestjs/swagger';

export class ClientDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  role: string;

  // @IsString()
  // @IsOptional()
  // dateOfBirth: string;

  // @IsString()
  // @IsOptional()
  // status: string;

  // @IsString()
  // @IsOptional()
  // address?: string;

  // @IsString()
  // @IsOptional()
  // gender?: string;

  // @IsString()
  // @IsOptional()
  // avatarUrl?: string;
}
