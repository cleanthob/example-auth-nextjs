import { NextRequest, NextResponse } from "next/server";
import { getAuthCookie, verifyJwt } from "./utils/jwt";

export async function proxy(request: NextRequest) {
  const token = await getAuthCookie();

  const isProtectedRoute = !request.nextUrl.pathname.startsWith("/login");

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  if (token) {
    const payload = verifyJwt(token);

    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", request.url));

      response.cookies.delete("authToken");
      return response;
    }

    if (token && verifyJwt(token)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
