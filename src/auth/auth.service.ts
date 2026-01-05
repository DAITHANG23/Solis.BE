import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { SigninDto, SignupDto } from './dto';
import Email from 'src/utils/emails';
import { authenticator } from 'otplib';
import { RedisService } from 'src/redis';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private userService: UserService,
    private redisService: RedisService,
  ) {}

  async signup(dto: SignupDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user) {
      throw new ForbiddenException('Email is existed');
    }

    try {
      const userBody = {
        email: dto.email,
        fullName: dto.fullName,
      };

      authenticator.options = { step: 90 };

      const secret = process.env.OTP_KEY_SECRET || '';

      const otp = authenticator.generate(secret);

      await new Email(userBody, '', otp).sendOTP();

      await this.redisService.clientInstance.setex(
        `otp:${dto.email}`,
        300,
        otp,
      );

      return { message: 'OTP is sent, please check your email!' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: SigninDto, sessionId?: string, ttlSeconds?: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const pwMatches = await argon.verify(user.hash, dto.password);

    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }
    return this.signToken(user.id, user.email, sessionId, ttlSeconds);
  }

  async validateUserCreds(email: string, password: string): Promise<any> {
    const user = await this.userService.getUser(email);

    if (!user) throw new BadRequestException();

    if (!(await argon.verify(user.hash, password)))
      throw new UnauthorizedException();

    return user;
  }

  async signToken(
    userId: string,
    email: string,
    sessionId?: string,
    ttlSeconds?: number,
  ): Promise<{ access_token: string; data: any; status: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    await this.redisService.clientInstance.setex(
      `session:${sessionId}`,
      ttlSeconds || 60 * 60 * 24 * 7,
      token,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash, ...userWithNoHash } = user;

    return {
      access_token: token,
      data: userWithNoHash,
      status: 'success',
    };
  }

  async signout(sessionId: string) {
    if (!sessionId) {
      throw new UnauthorizedException('Session ID is required');
    }

    await this.redisService.clientInstance.del(`session:${sessionId}`);

    return { message: 'Signed out successfully', status: 'success' };
  }

  async verifyOtp(dto: SignupDto, otp: string) {
    if (!otp) {
      throw new BadRequestException('OTP is required');
    }
    const hash = await argon.hash(dto.password);

    const storeOtp = await this.redisService.clientInstance.get(
      `otp:${dto.email}`,
    );

    if (!storeOtp) {
      throw new BadRequestException('OTP expired, please request a new one.');
    }

    try {
      await this.prisma.user.create({
        data: {
          email: dto.email,
          date_of_birth: dto.dateOfBirth,
          last_name: dto.lastName,
          first_name: dto.firstName,
          full_name: dto.fullName,
          gender: dto.gender,
          avatarUrl: dto.avatarUrl,
          role: dto.role || 'user',
          status: dto.status || 'pending',
          address: dto.address,
          hash,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }

    if (otp !== storeOtp) {
      throw new BadRequestException('Invalid OTP, please try again.');
    }

    await this.redisService.clientInstance.del(`otp:${dto.email}`);

    const url = `${process.env.FRONTEND_URL}/login`;
    const userEmail = { email: dto.email, fullName: dto.fullName };
    await new Email(userEmail, url).sendWelcome();

    return { message: 'Signup successful! Please login.', status: 'success' };
  }
}
