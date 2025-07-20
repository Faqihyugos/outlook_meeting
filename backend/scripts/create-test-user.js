import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create a test user
    const testUser = await prisma.user.upsert({
      where: { email: 'test@kpk.go.id' },
      update: {},
      create: {
        email: 'test@kpk.go.id',
        fullName: 'Test User',
        role: 'employee',
        isActive: true,
        password: await bcrypt.hash('Test123!', 10)
      }
    });

    console.log('Test user created:', testUser);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
