import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateClientDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
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
