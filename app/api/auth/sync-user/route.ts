import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authUserId, email, name } = body as {
      authUserId?: string;
      email?: string;
      name?: string | null;
    };

    if (!authUserId || !email) {
      return NextResponse.json(
        { error: "Missing authUserId or email" },
        { status: 400 }
      );
    }

    const inferredRole = email === "agent@nestscout.ai" ? "AGENT" : "USER";

    //  Try find by authUserId
    let user = await prisma.user.findUnique({
      where: { authUserId },
    });

    if (user) {
      user = await prisma.user.update({
        where: { authUserId },
        data: {
          email,
          name: name ?? null,
          role: inferredRole,
        },
      });

      return NextResponse.json({ user }, { status: 200 });
    }

    //  If not found, maybe an old row exists with same email
    const byEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (byEmail) {
      const updated = await prisma.user.update({
        where: { email },
        data: {
          authUserId,
          name: name ?? null,
          role: inferredRole,
        },
      });

      return NextResponse.json({ user: updated }, { status: 200 });
    }

    //  Otherwise create a brand new user
    const created = await prisma.user.create({
      data: {
        authUserId,
        email,
        name: name ?? null,
        role: inferredRole,
      },
    });

    return NextResponse.json({ user: created }, { status: 200 });
  } catch (err) {
    console.error("SYNC-USER ERROR", err);
    return NextResponse.json(
      { error: "Server error", details: `${err}` },
      { status: 500 }
    );
  }
}
