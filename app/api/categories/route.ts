import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongoose";
import { isAdminRequest } from "@/lib/auth";

import { Category } from "@/models/Category.model";

import { CategoryType } from "@/types/types";

export async function POST(request: Request) {
  await isAdminRequest();
  await dbConnect();

  const { categoryName, parentCategory, properties } = await request.json();
  const categoryData = {
    categoryName,
    parentCategory: parentCategory || undefined,
    properties,
  };

  const categoryDoc = await Category.create(categoryData);

  return NextResponse.json(categoryDoc);
}

export async function PUT(request: Request) {
  await isAdminRequest();
  await dbConnect();

  const body: CategoryType = await request.json();
  const { categoryName, parentCategory, _id, properties } = body;

  const categoryDoc = await Category.updateOne(
    { _id },
    { categoryName, parentCategory: parentCategory || undefined, properties },
  );

  return NextResponse.json(categoryDoc);
}

export async function GET() {
  await isAdminRequest();
  await dbConnect();

  return NextResponse.json(await Category.find().populate("parentCategory"));
}

export async function DELETE(request: NextRequest) {
  await isAdminRequest();
  await dbConnect();

  const _id = request.nextUrl.searchParams.get("id");

  if (!_id) return NextResponse.json("No id provided");

  await Category.deleteOne({ _id });
  return NextResponse.json("Category deleted");
}
