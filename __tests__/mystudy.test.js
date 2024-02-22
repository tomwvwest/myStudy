const { PrismaClient } = require("@prisma/client");
const seedDatabase = require("../seed/seed");

const prisma = new PrismaClient();

beforeEach(async () => {
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

//---------------------------------------

describe("GET note by id", () => {
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
  test("404 - return correct error when given id of a note that does not exist", async () => {
    const newNote = {
      note_name: "patched note",
      contents: "This is a patched note",
    };

    const response = await fetch("http://localhost:3000/api/notes/1000", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });
    expect(response.status).toBe(404);
    const err = await response.json();
    expect(err).toBe("Note not found");
  });
  test("400 - return correct error when bad request", async () => {
    const newNote = {
      note_name: "patched note",
      contents: "This is a patched note",
    };

    const response = await fetch("http://localhost:3000/api/notes/bad", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });
    expect(response.status).toBe(400);
    const err = await response.json();
    expect(err).toBe("Bad request");
  });
});

describe("DELETE a note by id", () => {
  test("204 - successfully removes note from db", async () => {
    const response = await fetch("http://localhost:3000/api/notes/1", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    expect(response.status).toBe(200);

    const checkExists = await fetch("http://localhost:3000/api/notes/1");
    expect(checkExists.status).toBe(404);
  });
});

describe("GET notes by user id", () => {
  test("200 - returns array of note objects", async () => {
    const response = await fetch("http://localhost:3000/api/notes/users/1");
    const { notes } = await response.json();

    expect(response.status).toBe(200);
    notes.forEach((note) => {
      expect(note).toEqual({
        note_id: expect.any(Number),
        user_id: 1,
        note_name: expect.any(String),
        contents: expect.any(String),
        created_at: expect.any(String),
      });
    });
  });
  test("404 - return correct error when given id of a user that does not exist", async () => {
    const response = await fetch(
      "http://localhost:3000/api/notes/users/100000"
    );
    expect(response.status).toBe(404);
    const err = await response.json();
    expect(err).toBe("User not found");
  });
  test("400 - return correct error when bad request", async () => {
    const response = await fetch("http://localhost:3000/api/notes/users/bad");
    expect(response.status).toBe(400);
    const err = await response.json();
    expect(err).toBe("Bad request");
  });
});

describe("POST a note by user id", () => {
  test("201 - returns correct note object and adds note to db", async () => {
    const newNote = {
      note_name: "new posted note",
      contents: "This is a new note",
    };

    const response = await fetch("http://localhost:3000/api/notes/users/1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });
    const { postedNote } = await response.json();

    expect(response.status).toBe(201);
    expect(postedNote).toEqual({
      note_name: "new posted note",
      contents: "This is a new note",
      user_id: 1,
      created_at: expect.any(String),
      note_id: 4,
    });

    const checkNoteExists = await fetch("http://localhost:3000/api/notes/4");
    const { note } = await checkNoteExists.json();
    expect(checkNoteExists.status).toBe(200);
    expect(note).toEqual({
      note_name: "new posted note",
      contents: "This is a new note",
      user_id: 1,
      created_at: expect.any(String),
      note_id: 4,
    });
  });
  test("404 - return correct error when given id of a user that does not exist", async () => {
    const newNote = {
      note_name: "new posted note",
      contents: "This is a new note",
    };

    const response = await fetch("http://localhost:3000/api/notes/users/1000", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });
    expect(response.status).toBe(404);
    const err = await response.json();
    expect(err).toBe("Error occured");
  });
  test("400 - return correct error when bad request", async () => {
    const newNote = {
      note_name: "new posted note",
      contents: "This is a new note",
    };

    const response = await fetch("http://localhost:3000/api/notes/users/bad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });
    expect(response.status).toBe(400);
    const err = await response.json();
    expect(err).toBe("Bad request");
  });
  test("201 - returns correct note object if contents is not specified", async () => {
    const newNote = {
      note_name: "new posted note",
    };

    const response = await fetch("http://localhost:3000/api/notes/users/1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });
    const { postedNote } = await response.json();

    expect(response.status).toBe(201);
    expect(postedNote).toEqual({
      note_name: "new posted note",
      contents: "",
      user_id: 1,
      created_at: expect.any(String),
      note_id: 4,
    });
  });
});

//---------------------------------------

describe("GET flashcards by id", () => {
  test("200 - return correct flashcard array", async () => {
    const response = await fetch("http://localhost:3000/api/cards/1");
    expect(response.status).toBe(200);
    const { card } = await response.json();
    expect(card).toEqual({
      cardSet_id: 1,
      cardSet_name: "History",
      user_id: 1,
      created_at: expect.any(String),
      contents: [
        ["What year did World War II end?", "1945"],
        [
          "Who was the first president of the United States?",
          "George Washington",
        ],
        ["What is the capital of France?", "Paris"],
      ],
    });
  });
  test("404 - return correct error when given id of a card that does not exist", async () => {
    const response = await fetch("http://localhost:3000/api/cards/100000");
    expect(response.status).toBe(404);
    const err = await response.json();
    expect(err).toBe("Cards not found");
  });
  test("400 - return correct error when bad request", async () => {
    const response = await fetch("http://localhost:3000/api/cards/bad");
    expect(response.status).toBe(400);
    const err = await response.json();
    expect(err).toBe("Bad request");
  });
});

describe("PATCH flashcard by id", () => {
  test("200 - returns patched note and updates db for name change only", async () => {
    const cardSetToPatch = {
      cardSet_name: "Patched History",
    };

    const response = await fetch("http://localhost:3000/api/cards/1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cardSetToPatch),
    });
    const { patchedCardSet } = await response.json();

    expect(response.status).toBe(200);
    expect(patchedCardSet).toEqual({
      cardSet_name: "Patched History",
      user_id: 1,
      contents: [
        ["What year did World War II end?", "1945"],
        [
          "Who was the first president of the United States?",
          "George Washington",
        ],
        ["What is the capital of France?", "Paris"],
      ],
      created_at: expect.any(String),
      cardSet_id: 1,
    });

    const checkCardExists = await fetch("http://localhost:3000/api/cards/1");
    const { card } = await checkCardExists.json();
    expect(checkCardExists.status).toBe(200);
    expect(card).toEqual({
      cardSet_name: "Patched History",
      user_id: 1,
      contents: [
        ["What year did World War II end?", "1945"],
        [
          "Who was the first president of the United States?",
          "George Washington",
        ],
        ["What is the capital of France?", "Paris"],
      ],
      created_at: expect.any(String),
      cardSet_id: 1
    });
  });
});

describe("GET flashcards by user id", () => {
  test("200 - returns array of card objects", async () => {
    const response = await fetch("http://localhost:3000/api/cards/users/1");
    expect(response.status).toBe(200);

    const { cardSets } = await response.json();

    cardSets.forEach((cardSet) => {
      expect(cardSet).toMatchObject({
        cardSet_id: expect.any(Number),
        cardSet_name: expect.any(String),
        user_id: 1,
        created_at: expect.any(String),
      });

      cardSet.contents.forEach((content) => {
        expect(Array.isArray(content)).toBe(true);
      });
    });
  });
  test("404 - return correct error when given id of a card that does not exist", async () => {
    const response = await fetch(
      "http://localhost:3000/api/cards/users/100000"
    );
    expect(response.status).toBe(404);
    const err = await response.json();
    expect(err).toBe("Cards not found");
  });
  test("400 - return correct error when bad request", async () => {
    const response = await fetch("http://localhost:3000/api/cards/users/bad");
    expect(response.status).toBe(400);
    const err = await response.json();
    expect(err).toBe("Bad request");
  });
});

describe("POST flashcard by user id", () => {
  test("201 - return posted flashcards and check they have been added to db", async () => {
    const newCardSet = {
      cardSet_name: "Maths",
      contents: [
        ["1+1", "2"],
        ["2+2", "4"],
        ["3+3", "6"],
      ],
    };

    const response = await fetch("http://localhost:3000/api/cards/users/1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCardSet),
    });
    const { postedCard } = await response.json();

    expect(response.status).toBe(201);
    expect(postedCard).toEqual({
      cardSet_name: "Maths",
      contents: [
        ["1+1", "2"],
        ["2+2", "4"],
        ["3+3", "6"],
      ],
      user_id: 1,
      created_at: expect.any(String),
      cardSet_id: 4,
    });

    const checkCardExists = await fetch("http://localhost:3000/api/cards/4");
    const { card } = await checkCardExists.json();
    expect(checkCardExists.status).toBe(200);
    expect(card).toEqual({
      cardSet_name: "Maths",
      contents: [
        ["1+1", "2"],
        ["2+2", "4"],
        ["3+3", "6"],
      ],
      user_id: 1,
      created_at: expect.any(String),
      cardSet_id: 4,
    });
  });
  test("404 - return correct error when given id of a card that does not exist", async () => {
    const newCardSet = {
      cardSet_name: "Maths",
      contents: [
        ["1+1", "2"],
        ["2+2", "4"],
        ["3+3", "6"],
      ],
    };

    const response = await fetch(
      "http://localhost:3000/api/cards/users/100000",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCardSet),
      }
    );
    expect(response.status).toBe(404);
    const err = await response.json();
    expect(err).toBe("User not found");
  });
  test("400 - return correct error when bad request", async () => {
    const newCardSet = {
      cardSet_name: "Maths",
      contents: [
        ["1+1", "2"],
        ["2+2", "4"],
        ["3+3", "6"],
      ],
    };

    const response = await fetch("http://localhost:3000/api/cards/users/bad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCardSet),
    });
    expect(response.status).toBe(400);
    const err = await response.json();
    expect(err).toBe("Bad request");
  });
});
