import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Length,
  IsOptional,
  IsIn,
} from 'class-validator';
export class SignupDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'admin@domiquefusion.store',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'Admin@123',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Length(8, 20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character',
    },
  )
  password: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'Dom',
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @Length(1, 20, { message: 'First name must be between 1 and 20 characters' })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Nguyen',
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @Length(1, 20, { message: 'Last name must be between 1 and 20 characters' })
  lastName: string;

  @ApiProperty({
    description: 'Date of birth of the user',
    example: '23-06-1997',
  })
  @IsString({ message: 'Date of birth must be a string' })
  @IsNotEmpty({ message: 'Date of birth cannot be empty' })
  dateOfBirth: string;

  @ApiProperty({
    description: 'Address of the user',
    example: 'Ho Chi Minh City',
  })
  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address cannot be empty' })
  @Length(1, 100, { message: 'Address must be between 1 and 100 characters' })
  address: string;

  @ApiProperty({
    description: 'Role of the user',
    example: 'Admin',
  })
  @IsString({ message: 'Role must be a string' })
  @IsOptional()
  @IsIn(['admin', 'user', 'accountant', 'restaurantManager', 'conceptManager'])
  role: string = 'user';

  @ApiProperty({
    description: 'Gender of the user',
    example: 'male',
  })
  @IsString({ message: 'Gender must be a string' })
  @IsOptional()
  @IsIn(['male', 'female', 'other'])
  gender: string = 'male';

  @ApiProperty({
    description: 'Status of the user account',
    example: 'verify',
  })
  @IsString({ message: 'Status must be a string' })
  @IsOptional()
  @IsIn(['verify', 'pending', 'restrict', 'cancel'])
  status: string = 'pending';

  @ApiProperty({
    description: 'Avatar of the user',
    example:
      'https://res.cloudinary.com/dn797d3j3/image/upload/v1746351190/banners/cover-img-4_eepkyd.png',
  })
  @IsString({ message: 'Avatar must be a string' })
  @IsNotEmpty({ message: 'Avatar cannot be empty' })
  avatarUrl: string;
}
