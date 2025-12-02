import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { authUserId } = await req.json();

    if (!authUserId) {
      return NextResponse.json(
        { error: "Missing authUserId" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { authUserId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("GET ME ERROR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
