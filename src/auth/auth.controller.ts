import {
  Body,
  Controller,
  ForbiddenException,
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
  async signin(
    @Body() dto: SigninDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const ttlSeconds = 60 * 60 * 24 * 7;
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const result = await this.authService.signToken(user.id, dto.email);

    if (isProd) {
      res.setCookie('accessToken', result.accessToken, {
        expires: new Date(Date.now() + ttlSeconds * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: '.domiquefusion.store',
      });
    }

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
  signout(@Req() req: any, @Res({ passthrough: true }) res: FastifyReply) {
    res.clearCookie('accessToken', {
      httpOnly: isProd ? true : false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return this.authService.signout();
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  verifyOtp(@Body() dto: SignupDto, @Body('otp') otp: string) {
    return this.authService.verifyOtp(dto, otp);
  }
}
