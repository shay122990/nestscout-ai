import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authUserId, email, name } = body;

    if (!authUserId || !email) {
      return NextResponse.json(
        { error: "Missing authUserId or email" },
        { status: 400 }
      );
    }

    const user = await prisma.user.upsert({
      where: { authUserId },
      update: { email, name: name ?? null },
      create: {
        authUserId,
        email,
        name: name ?? null,
        role: "USER",
      },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", details: `${err}` },
      { status: 500 }
    );
  }
}
