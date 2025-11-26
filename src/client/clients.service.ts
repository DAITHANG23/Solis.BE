import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientDto } from './dto';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async createClient(createClient: ClientDto) {
    try {
      return await this.prisma.client.create({
        data: {
          email: createClient.email,
          first_name: createClient.firstName,
          last_name: createClient.lastName,
          role: createClient.role,
        },
      });
    } catch (err) {
      console.log('PRISMA ERROR >>>', err);
      throw err;
    }
  }
}
