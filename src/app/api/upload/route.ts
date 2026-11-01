import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2/client";


const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
]);

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { error: "Cloudflare R2 sozlamalari (.env.local) to‘liq emas." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string | null) || "writing-task1";

    if (!file) {
      return NextResponse.json({ error: "Yuklash uchun fayl tanlanmadi." }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Faqat rasm fayllari (PNG, JPG, WEBP, SVG) qabul qilinadi. Kiritilgan format: ${file.type}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Fayl hajmi 15MB dan oshmasligi kerak." },
        { status: 400 }
      );
    }

    const safeName = sanitizeFileName(file.name || "chart.png");
    const uniqueKey = `${folder.replace(/\/+$/, "")}/${Date.now()}-${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueKey,
      Body: buffer,
      ContentType: file.type,
      ContentLength: buffer.length,
    });

    await r2Client.send(command);

    const publicUrl = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL}/${uniqueKey}`
      : `https://${R2_BUCKET_NAME}.r2.cloudflarestorage.com/${uniqueKey}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      key: uniqueKey,
      name: file.name,
      size: file.size,
      contentType: file.type,
    });
  } catch (error: any) {
    console.error("Cloudflare R2 upload error:", error);
    return NextResponse.json(
      {
        error: error.message || "Rasm yuklashda xatolik yuz berdi. Iltimos qaytadan urinib ko‘ring.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    bucket: R2_BUCKET_NAME,
    publicUrlConfigured: Boolean(R2_PUBLIC_URL),
  });
}
