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
import { GoogleLoginDto, SignoutResponseDto, SignupDto } from './dto';
import { JwtAuthGuard } from './guard';
import type { FastifyReply } from 'fastify';
import { isProd } from 'src/utils/constants';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('google-login')
  async googleLogin(
    @Body() dto: GoogleLoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const result = await this.authService.googleLogin(dto);
    return this.setAuthCookies(res, result);
  }

  private setAuthCookies(res: FastifyReply, result: any) {
    const accessTokenTtlSeconds = 60 * 60 * 24;
    const refreshTokenTtlSeconds = 60 * 60 * 24 * 7;

    if (isProd) {
      res.setCookie('accessToken', result.accessToken, {
        expires: new Date(Date.now() + accessTokenTtlSeconds * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: '.domiquefusion.store',
      });

      res.setCookie('refreshToken', result.refreshToken, {
        expires: new Date(Date.now() + refreshTokenTtlSeconds * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: '.domiquefusion.store',
      });

      delete result.accessToken;
      delete result.refreshToken;
    }

    return result;
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
    res.clearCookie('accessToken', {
      httpOnly: isProd ? true : false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.clearCookie('refreshToken', {
      httpOnly: isProd ? true : false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return this.authService.signout();
  }

  @ApiCreatedResponse({
    description: 'Verify OTP',
    type: SignoutResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'User cannot verify OTP. Try again!',
  })
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  verifyOtp(@Body() dto: SignupDto, @Body('otp') otp: string) {
    return this.authService.verifyOtp(dto, otp);
  }

  @ApiCreatedResponse({
    description: 'Refresh Access Token',
  })
  @ApiBadRequestResponse({
    description: 'Cannot refresh access token. Try again!',
  })
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    let refreshTokenValue = '';

    if (isProd) {
      refreshTokenValue = req.cookies['refreshToken'];
    } else {
      refreshTokenValue = refreshToken;
    }

    const result = await this.authService.refreshToken(refreshTokenValue);

    if (isProd) {
      const accessTokenTtlSeconds = 60 * 60 * 24;
      res.setCookie('accessToken', result.accessToken, {
        expires: new Date(Date.now() + accessTokenTtlSeconds * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: '.domiquefusion.store',
      });

      delete (result as any).accessToken;
    }

    return result;
  }
}
