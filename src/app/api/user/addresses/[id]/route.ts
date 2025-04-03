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
    const body = await request.json();
    const { street, city, state, postalCode, country, isDefault } = body;

    if (!street || !city || !state || !postalCode || !country) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

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

    // If this is the default address, unset any existing default
    if (isDefault && !existingAddress.isDefault) {
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

    // Update address
    const address = await prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        street,
        city,
        state,
        postalCode,
        country,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(
      { message: "Address updated successfully", address },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

    // Delete address
    await prisma.address.delete({
      where: {
        id: addressId,
      },
    });

    return NextResponse.json(
      { message: "Address deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
