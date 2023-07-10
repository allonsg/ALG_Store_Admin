import { NextResponse } from "next/server";
import mongoose from "mongoose";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  // mongoose.connect(clientPromise.);
  // 18:39 ecommerce2-premium-04-admin-products
  return NextResponse.json({ name: "ALG Store Admin" });
}
