import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";

export async function GET(req, { params }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json("Bad request", { status: 400 });

  const cardSets = await prisma.cardSets.findMany({
    where: {
      user_id: id,
    },
  });

  if (!cardSets.length) {
    return NextResponse.json("Cards not found", { status: 404 });
  }

  cardSets.forEach(cardSet => {
    const parsedContents = cardSet.contents.map(arr => JSON.parse(arr))
    cardSet.contents = parsedContents
  })

  return NextResponse.json({ cardSets, status: 200 });
}
