import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninDto, SignoutResponseDto, SignupDto } from './dto';
import { JwtAuthGuard, LocalAuthGuard } from './guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({
    description: 'Signup',
    type: SignupDto,
  })
  @ApiBadRequestResponse({
    description: 'User cannot sign up. Try again!',
  })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @UseGuards(LocalAuthGuard)
  @ApiCreatedResponse({
    description: 'Signin',
    type: SigninDto,
  })
  @ApiBadRequestResponse({
    description: 'User cannot sign in. Try again!',
  })
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Signout',
    type: SignoutResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'User cannot sign out. Try again!',
  })
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  signout() {
    return {
      message: 'Signed out successfully',
    };
  }
}
