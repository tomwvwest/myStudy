import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { parseSetCookie } from "next/dist/compiled/@edge-runtime/cookies";

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

  cardSets.forEach((cardSet) => {
    const parsedContents = cardSet.contents.map((arr) => JSON.parse(arr));
    cardSet.contents = parsedContents;
  });

  return NextResponse.json({ cardSets, status: 200 });
}

export async function POST(req, { params }) {
  try{
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json("Bad request", { status: 400 });

  const { cardSet_name, contents } = await req.json();
  const formattedContents = contents.map(content => JSON.stringify(content))

  const newCard = await prisma.cardSets.create({
    data: { cardSet_name, contents: formattedContents, user_id: id },
  });

  if (!newCard) {
    return NextResponse.json("Error occured", { status: 500 });
  }

  const parsedContents = newCard.contents.map(content => JSON.parse(content))
  newCard.contents = parsedContents

  return NextResponse.json({ postedCard: newCard }, { status: 201 });
} catch(err){
  return NextResponse.json("User not found", { status: 404 });

}
}
