import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    themeColor: process.env.NEXT_PUBLIC_THEME_COLOR,
    allEnvs: {
      NEXT_PUBLIC_IFRAME_URL: process.env.NEXT_PUBLIC_IFRAME_URL,
      NEXT_PUBLIC_THEME_COLOR: process.env.NEXT_PUBLIC_THEME_COLOR,
      NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    },
  });
}
