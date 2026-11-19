import { getAuthCookie, verifyJwt } from "@/utils/jwt";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getAuthCookie();
  const payload = token ? verifyJwt(token) : null;

  if (!payload) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  return NextResponse.json({
    userId: payload.userId,
    username: payload.username,
  });
}
