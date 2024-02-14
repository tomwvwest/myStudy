const { NextResponse } = require("next/server");
const { prisma } = require("../../../../../lib/prisma");

export async function GET(req, { params }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json("Bad request", { status: 400 });

  const user = await prisma.users.findUnique({
    where: {
      user_id: id,
    },
  });

  if (!user) return NextResponse.json("User not found", { status: 404 });
  
  return NextResponse.json({ user, status: 200 });
}
