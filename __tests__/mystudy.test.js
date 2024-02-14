const { PrismaClient } = require("@prisma/client");
const seedDatabase = require("../seed/seed");

let prisma;

beforeEach(async () => {
  prisma = new PrismaClient();
  await seedDatabase();
});

afterAll(async () => {
  await seedDatabase();
  await prisma.$disconnect();
  console.log("End of Tests");
});

describe("GET user by ID", () => {
  test("200 - returns correct user object", async () => {
    const response = await fetch("http://localhost:3000/api/users/1");
    const { user } = await response.json();

    expect(response.status).toBe(200);
    expect(user).toEqual({
      user_id: 1,
      username: "tom",
      password: "tom",
      colour: "#849483",
    });
  });
  test("404 - return correct error when given id of a user that does not exist", async () => {
    const response = await fetch("http://localhost:3000/api/users/100000");
    expect(response.status).toBe(404);
    const err = await response.json();
    expect(err).toBe("User not found");
  });
  test("400 - return correct error when bad request", async () => {
    const response = await fetch("http://localhost:3000/api/users/bad");
    expect(response.status).toBe(400);
    const err = await response.json();
    expect(err).toBe("Bad request");
  });
});

describe("GET notes by id", () => {
  test("200 - returns correct note object", async () => {
    const response = await fetch("http://localhost:3000/api/notes/1");
    const { note } = await response.json();

    expect(response.status).toBe(200);
    expect(note).toEqual({
      note_id: 1,
      user_id: 1,
      created_at: expect.any(String),
      note_name: "Physics",
      contents:
        "Physics is the study of matter, energy, and the fundamental forces that govern the universe. It encompasses various branches such as classical mechanics, electromagnetism, thermodynamics, quantum mechanics, and relativity. Classical mechanics describes the motion of macroscopic objects based on Newton's laws of motion. Electromagnetism deals with electric and magnetic fields and their interactions with charged particles. Thermodynamics studies the transfer of heat and energy within systems. Quantum mechanics explores the behavior of particles at the smallest scales, while relativity addresses the relationship between space, time, and gravity. Physics plays a crucial role in understanding natural phenomena and shaping technological advancements.",
    });
  });
  test("404 - return correct error when given id of a note that does not exist", async () => {
    const response = await fetch("http://localhost:3000/api/notes/100000");
    expect(response.status).toBe(404);
    const err = await response.json();
    expect(err).toBe("Note not found");
  });
  test("400 - return correct error when bad request", async () => {
    const response = await fetch("http://localhost:3000/api/notes/bad");
    expect(response.status).toBe(400);
    const err = await response.json();
    expect(err).toBe("Bad request");
  });
});

describe("PATCH note by id", () => {
  test("200 - returns updated note object and successfully updates db", async () => {
    const newNote = {
      note_name: "patched note",
      contents: "This is a patched note",
    };

    const response = await fetch("http://localhost:3000/api/notes/1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });
    const { patchedNote } = await response.json();

    expect(response.status).toBe(200);
    expect(patchedNote).toEqual({
      note_id: 1,
      user_id: 1,
      created_at: expect.any(String),
      note_name: "patched note",
      contents: "This is a patched note",
    });

    const patchedResponse = await fetch("http://localhost:3000/api/notes/1");
    const { note } = await patchedResponse.json();
    expect(note).toEqual({
      note_id: 1,
      user_id: 1,
      created_at: expect.any(String),
      note_name: "patched note",
      contents: "This is a patched note",
    });
  });
});
