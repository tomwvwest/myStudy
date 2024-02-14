import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(req, { params }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json("Bad request", { status: 400 });

  const note = await prisma.notes.findUnique({
    where: {
      note_id: id,
    },
  });

  if (!note) return NextResponse.json("Note not found", { status: 404 });

  return NextResponse.json({ note, status: 200 });
}

export async function PATCH(req, { params }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json("Bad request", { status: 400 });

  const body = await req.json();

  const noteToPatch = await prisma.Notes.findUnique({
    where: {
      note_id: id,
    },
  });

  if (!noteToPatch) {
    return NextResponse.json("Note not found", { status: 404 });
  }

  const keysToUpdate = Object.keys(body);

  keysToUpdate.forEach((key) => {
    noteToPatch[key] = body[key];
  });

  const patchedNote = await prisma.Notes.update({
    where: {
      note_id: id,
    },
    data: noteToPatch,
  });
  
  return NextResponse.json({ patchedNote, status: 200 });
}
