import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user;
  }

  async updateUser(userId: string, dto: UserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { ...dto },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash, ...userWithNoHash } = user;

    return userWithNoHash;
  }
}
