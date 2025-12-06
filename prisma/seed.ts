import { PrismaClient } from '../generated/prisma'
import * as argon from 'argon2';
const prisma = new PrismaClient()

async function main() { 
    const adminTest = await prisma.user.upsert({
        where: { email: "adminTest@gmail.com"},
        update: {},
        create: {
            email: "adminTest@gmail.com",
            first_name: "Admin",
            last_name: "Test",
            role: "admin",
            hash: await argon.hash("AdminTest123!"),
            address: "123 Admin St, Admin City, Admin State, 12345",
            date_of_birth: String(new Date("1990-01-01")),
            gender: "male",
            avatarUrl: "https://example.com/avatar/adminTest.png",
            status: "active",
        }
    })

    const clientTest = await prisma.client.upsert({
        where: { email: "clientTest@gmail.com"},
        update: {},
        create: {
            email: "clientTest@gmail.com",
            first_name: "Client",
            last_name: "Test",
            role:"customer",
        }
    })
    console.log({adminTest, clientTest});
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })