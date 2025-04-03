import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const addressId = params.id;

    // Check if address belongs to user
    const existingAddress = await prisma.address.findUnique({
      where: {
        id: addressId,
      },
    });

    if (!existingAddress || existingAddress.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 },
      );
    }

    // Unset any existing default address
    await prisma.address.updateMany({
      where: {
        userId: session.user.id,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    // Set this address as default
    const address = await prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        isDefault: true,
      },
    });

    return NextResponse.json(
      { message: "Default address updated successfully", address },
      { status: 200 },
    );
  } catch (error) {
    console.error("Set default address error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
