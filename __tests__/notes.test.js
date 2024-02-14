const { prisma } = require('../lib/prisma');
const seedDatabase = require('../seed/seed')

beforeEach(async() => {
  await seedDatabase();
})

afterAll(async () => {
  await prisma.$disconnect();
  console.log('End of Tests')
})

describe('GET notes by id', )