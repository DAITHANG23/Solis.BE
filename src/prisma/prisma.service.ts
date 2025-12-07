import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  constructor() {
    const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
    super({
      adapter: pool,
      errorFormat: 'minimal',
      log:
        process.env.NODE_ENV !== 'production'
          ? ['query', 'warn', 'error']
          : ['warn', 'error'],
    });
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting Control Plane database...');
    await this.$disconnect();
    this.logger.log('Disconnected.');
  }
  async onModuleInit() {
    this.logger.log('Connecting to Control Plane database...');
    await this.$connect();
    this.logger.log('Connected.');
  }
}
