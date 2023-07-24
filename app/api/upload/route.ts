import { NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

import dbConnect from "@/lib/mongoose";
import { ProductImageType } from "@/types/types";

export async function POST(request: Request) {
  await dbConnect();

  const formData = await request.formData();
  const imageList = formData.getAll("image") as Blob[] | null;

  if (!imageList) {
    return NextResponse.json(
      { error: "File blob is required." },
      { status: 400 },
    );
  }

  const client = new S3Client({
    region: "eu-central-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });

  const linkList: ProductImageType[] = [];

  for (const image of imageList) {
    const buffer = Buffer.from(await image.arrayBuffer());
    const extension = image.name.split(".").pop();
    const newFileName = `${image.name}-${uuidv4()}.${extension}`;

    try {
      await client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET!,
          Key: newFileName,
          Body: buffer,
          ACL: "public-read",
          ContentType: image.type,
        }),
      );

      const url = `https://${process.env
        .AWS_BUCKET!}.s3.eu-central-1.amazonaws.com/${newFileName}`;

      linkList.push({ url, id: newFileName });
    } catch (err) {
      console.error("Error with uploading on S3:", err);
    }
  }

  return NextResponse.json({ linkList });
}
