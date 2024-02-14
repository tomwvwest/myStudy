const { prisma } = require('../lib/prisma');
const seedDatabase = require('../seed/seed')

beforeEach(async() => {
  await seedDatabase();
})

afterAll(async () => {
  await prisma.$disconnect();
  console.log('End of Tests')
})

describe('GET user by ID', () => {
  test("200 - returns correct user object", async () => {
    const response = await fetch("http://localhost:3000/api/users/1")
    const {user} = await response.json()

    expect(response.status).toBe(200)
    expect(user).toEqual({
      user_id: 1,
      username: 'tom',
      password: 'tom',
      colour: '#849483',
    });
  })
  test("404 - return correct error when given id of a user that does not exist", async () => {
    const response = await fetch("http://localhost:3000/api/users/100000");
    expect(response.status).toBe(404);
    const err = await response.json()
    expect(err).toBe("User not found")
  });
  test("400 - return correct error when bad request", async () => {
    const response = await fetch("http://localhost:3000/api/users/bad");
    expect(response.status).toBe(400);
    const err = await response.json()
    expect(err).toBe("Bad request")
  });
})
