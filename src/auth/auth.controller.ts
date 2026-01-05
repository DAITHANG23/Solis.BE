import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
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
import crypto from 'crypto';
import type { FastifyReply } from 'fastify';
import { isProd } from 'src/utils/constants';

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
  signin(
    @Body() dto: SigninDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const sessionId = crypto.randomBytes(16).toString('hex');

    const ttlSeconds = 60 * 60 * 24 * 7;
    if (isProd) {
      res.setCookie('sessionId', sessionId, {
        expires: new Date(Date.now() + ttlSeconds * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: '.domiquefusion.store',
      });
    }

    return this.authService.signin(dto, sessionId, ttlSeconds);
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
  signout(@Req() req: any, @Res({ passthrough: true }) res: FastifyReply) {
    const sessionId = req.cookies.sessionId;
    res.clearCookie('sessionId', {
      httpOnly: isProd ? true : false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return this.authService.signout(sessionId);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  verifyOtp(@Body() dto: SignupDto, @Body('otp') otp: string) {
    return this.authService.verifyOtp(dto, otp);
  }
}
