import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClientService } from './clients.service';
import { ClientController } from './clients.controller';

@Module({
  imports: [JwtModule.register({}), PrismaModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
