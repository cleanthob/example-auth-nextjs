import jwt from "jsonwebtoken";

import { User } from "@/types/user";
import { cookies } from "next/headers";

export type JwtPayload = User & {
  iat?: number;
  exp?: number;
};

export async function getAuthCookie() {
  const cookieStore = await cookies();

  return cookieStore.get("authToken")?.value || null;
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, String(process.env.JWT_SECRET)) as JwtPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
