import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(req, { params }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json("Bad request", { status: 400 });

  const card = await prisma.cardSets.findUnique({
    where: {
      cardSet_id: id,
    },
  });

  if (!card) {
    return NextResponse.json("Cards not found", { status: 404 });
  }

  const { contents } = card;
  const parsedContents = contents.map((arr) => JSON.parse(arr));
  card.contents = parsedContents;

  return NextResponse.json({ card, status: 200 });
}
