import { isAdminRequest } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { Order } from "@/models/Order.model";

export async function GET() {
  await isAdminRequest();
  await dbConnect();

  return NextResponse.json(await Order.find().sort({ createdAt: -1 }));
}
