import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/users/user.module';
import { UserService } from 'src/users/user.service';

@Module({
  imports: [JwtModule.register({}), PrismaModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService],
})
export class AuthModule {}
