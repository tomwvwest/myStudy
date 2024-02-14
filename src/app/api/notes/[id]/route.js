import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(res, {params}){
  const id = Number(params.id)
  if (isNaN(id)) return NextResponse.json("Bad request", { status: 400 });

  const note = await prisma.notes.findUnique({
    where: {
      note_id: id,
    },
  });

  if (!note) return NextResponse.json("Note not found", { status: 404 });
  
  return NextResponse.json({ note, status: 200 });
}