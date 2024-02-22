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

export async function PATCH(req, { params }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json("Bad request", { status: 400 });
  const body = await req.json();

  const cardToPatch = await prisma.cardSets.findUnique({
    where:{
      cardSet_id: id
    }
  })

  const keysToUpdate = Object.keys(body)

  keysToUpdate.forEach(key => {
    cardToPatch[key] = body[key]
  })

  const patchedCardSet = await prisma.cardSets.update({
    where:{
      cardSet_id : id
    },
    data: cardToPatch
  })

  const parsedContents = patchedCardSet.contents.map(content => JSON.parse(content))
  patchedCardSet.contents = parsedContents

  return NextResponse.json({patchedCardSet, status:200})
}
