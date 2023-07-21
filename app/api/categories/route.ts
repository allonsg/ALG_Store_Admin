import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongoose";
import { Category } from "@/models/Category.model";
import { CategoryType } from "@/Types/types";

export async function POST(request: Request) {
  await dbConnect();

  const { categoryName, parentCategory } = await request.json();
  const categoryData = parentCategory
    ? { categoryName, parentCategory }
    : { categoryName };
  const categoryDoc = await Category.create(categoryData);

  return NextResponse.json(categoryDoc);
}

export async function PUT(request: Request) {
  await dbConnect();

  const body: CategoryType = await request.json();
  const { categoryName, parentCategory, _id } = body;

  const categoryDoc = await Category.updateOne(
    { _id },
    { categoryName, parentCategory },
  );

  return NextResponse.json(categoryDoc);
}

export async function GET() {
  await dbConnect();

  return NextResponse.json(await Category.find().populate("parentCategory"));
}

export async function DELETE(request: NextRequest) {
  await dbConnect();

  const _id = request.nextUrl.searchParams.get("id");

  if (!_id) return NextResponse.json("No id provided");

  await Category.deleteOne({ _id });
  return NextResponse.json("Category deleted");
}
