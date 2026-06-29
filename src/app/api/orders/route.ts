import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentMethodType } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user, address, paymentMethod, paymentRef, items } = body;

    if (!user || !items || items.length === 0) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // 1. Create or update user
    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name }, // Ideally we'd store address/phone here too if schema had it
      create: {
        email: user.email,
        name: user.name,
        password: "guest_checkout", // Placeholder since we don't have real auth yet
      }
    });

    // 2. Calculate total
    const totalAmount = items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);

    // 3. Create Order
    const order = await prisma.order.create({
      data: {
        userId: dbUser.id,
        totalAmount,
        paymentMethod: paymentMethod as PaymentMethodType,
        paymentRef,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            customImage: item.customImage
          }))
        }
      }
    });

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
