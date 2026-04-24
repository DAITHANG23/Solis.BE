import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import appConfig from 'src/config/app.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { isProd } from 'src/utils/constants';

const cookieOrBearerExtractor = (req: Request): string | null => {
  if (isProd) {
    return req?.cookies?.['access_token'] ?? null;
  }

  return (
    req?.cookies?.['access_token'] ??
    ExtractJwt.fromAuthHeaderAsBearerToken()(req)
  );
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: cookieOrBearerExtractor,
      secretOrKey: appConfig().appSecret!,
    });
  }

  async validate(payload: { email: string; sub: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
