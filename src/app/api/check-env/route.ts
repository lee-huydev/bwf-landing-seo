import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_THEME_COLOR: process.env.NEXT_PUBLIC_THEME_COLOR,
    NODE_ENV: process.env.NODE_ENV,
    envFile: "loaded from .env.local",
  });
}
