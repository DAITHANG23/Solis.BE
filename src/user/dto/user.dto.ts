import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  fullName: string;

  @IsString()
  role: string;

  @IsString()
  dateOfBirth: string;

  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  gender: string;

  @IsString()
  @IsOptional()
  avatarUrl: string;
}
