import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { authUserId?: string };

    if (!body.authUserId) {
      return NextResponse.json(
        { error: "Missing authUserId" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { authUserId: body.authUserId },
      include: {
        favorites: {
          include: {
            listing: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", user: null },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("PROFILE API ERROR", err);
    return NextResponse.json(
      { error: "Server error", details: `${err}` },
      { status: 500 }
    );
  }
}
