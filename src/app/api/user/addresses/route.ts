import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        isDefault: "desc",
      },
    });

    return NextResponse.json({ addresses }, { status: 200 });
  } catch (error) {
    console.error("Get addresses error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { street, city, state, postalCode, country, isDefault } = body;

    if (!street || !city || !state || !postalCode || !country) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // If this is the default address, unset any existing default
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Create new address
    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        street,
        city,
        state,
        postalCode,
        country,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(
      { message: "Address created successfully", address },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
