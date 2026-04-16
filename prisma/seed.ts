import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

const prisma = new PrismaClient({
  adapter: pool,
});

async function main() {
  const adminTest = await prisma.user.upsert({
    where: { email: 'nguyendaithang23061997@gmail.com' },
    update: {},
    create: {
      email: 'nguyendaithang23061997@gmail.com',
      first_name: 'Thang',
      last_name: 'Nguyen Dai',
      full_name: 'Nguyen Dai Thang',
      role: 'admin',
      address: '123 Admin St, Admin City, Admin State, 12345',
      date_of_birth: String(new Date('1997-06-23')),
      gender: 'male',
      avatarUrl: 'https://example.com/avatar/adminTest.png',
      status: 'active',
    },
  });

  const clientTest = await prisma.client.upsert({
    where: { email: 'clientTest@gmail.com' },
    update: {},
    create: {
      email: 'clientTest@gmail.com',
      first_name: 'Client',
      last_name: 'Test',
      role: 'customer',
    },
  });
  console.log({ adminTest, clientTest });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
