const { PrismaClient } = require("@prisma/client");
const { users, notes } = require("../data/index");
const prisma = new PrismaClient();

const seedDatabase = async () => {
  try {
    await prisma.$executeRaw`TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Notes" RESTART IDENTITY CASCADE`;

    await prisma.users.createMany({ data: users });
    await prisma.notes.createMany({ data: notes });

    console.log('Data successfully inserted');
  } catch (error) {
    console.log('Error inserting data:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seedDatabase();
