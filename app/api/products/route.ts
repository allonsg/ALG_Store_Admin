import { NextRequest, NextResponse } from "next/server";

import { Product } from "@/models/Product.model";
import dbConnect from "@/lib/mongoose";
import { ProductType } from "@/Types/types";

export async function POST(request: Request) {
  await dbConnect();

  const body: ProductType = await request.json();
  const { title, description, price, images } = body;

  const productDoc: ProductType = await Product.create({
    title,
    description,
    price,
    images,
  });
  return NextResponse.json(productDoc);
}

export async function GET(request: NextRequest) {
  await dbConnect();

  const id = request.nextUrl.searchParams.get("id");
  if (id) {
    const product = await Product.findById({ _id: id });
    return NextResponse.json(product);
  }

  const productList: ProductType[] = await Product.find();
  return NextResponse.json(productList);
}

export async function PUT(request: Request) {
  await dbConnect();

  const body: ProductType = await request.json();
  const { title, description, price, images, _id } = body;

  const updatedProduct = await Product.updateOne(
    { _id },
    { title, description, price, images },
  );

  return NextResponse.json(updatedProduct);
}

export async function DELETE(request: NextRequest) {
  await dbConnect();

  const id = request.nextUrl.searchParams.get("id");

  if (!id) return NextResponse.json("No id provided");

  await Product.deleteOne({ _id: id });
  return NextResponse.json("Product deleted");
}
