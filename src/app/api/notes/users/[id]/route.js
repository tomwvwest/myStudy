import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";

export async function GET(req, { params }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json("Bad request", { status: 400 });

  const notes = await prisma.Notes.findMany({
    where: {
      user_id: id,
    },
  });

  if (!notes.length) {
    return NextResponse.json("User not found", { status: 404 });
  }

  return NextResponse.json({ notes, status: 200 });
}

export async function POST(req, { params }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json("Bad request", { status: 400 });
    const body = await req.json();

    const newNote = await prisma.notes.create({
      data: { ...body, user_id: id },
    });

    if (!newNote) {
      return NextResponse.json("Error occured", { status: 500 });
    }

    return NextResponse.json({ postedNote: newNote }, { status: 201 });
  } catch (err) {
    return NextResponse.json("Error occured", { status: 404 });
  }
}
