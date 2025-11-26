import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Length,
} from 'class-validator';
export class SigninDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

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
}
