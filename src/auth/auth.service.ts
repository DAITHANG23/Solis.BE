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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private userService: UserService,
  ) {}

  async signup(dto: SignupDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          date_of_birth: dto.dateOfBirth,
          last_name: dto.lastName,
          first_name: dto.firstName,
          fullName: dto.fullName,
          gender: dto.gender,
          avatarUrl: dto.avatarUrl,
          role: dto.role || 'user',
          status: dto.status || 'pending',
          address: dto.address,
          hash,
        },
      });

      const userBody = {
        email: user.email,
        fullName: dto.fullName,
      };

      authenticator.options = { step: 90 };

      const secret = process.env.OTP_KEY_SECRET || '';

      const otp = authenticator.generate(secret);

      await new Email(userBody, '', otp).sendOTP();

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

  async signin(dto: SigninDto) {
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
    return this.signToken(user.id, user.email);
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

    return {
      access_token: token,
      data: user,
      status: 'success',
    };
  }
}
