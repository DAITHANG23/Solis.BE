import { IsEmail, IsString } from 'class-validator';

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
  address: string;

  @IsString()
  gender: string;

  @IsString()
  avatarUrl: string;
}
