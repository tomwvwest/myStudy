const { users, notes, cards } = require("../data/index");
const { prisma } = require("../lib/prisma");

const seedDatabase = async () => {
  try {
    await prisma.$executeRaw`TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Notes" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "CardSets" RESTART IDENTITY CASCADE`;

    await prisma.users.createMany({ data: users });
    await prisma.notes.createMany({ data: notes });
    await prisma.cardSets.createMany({ data: cards });

    // console.log("Data successfully inserted");
  } catch (error) {
    console.log("Error inserting data:", error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = seedDatabase;
