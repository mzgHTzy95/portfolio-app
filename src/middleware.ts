import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow the login page itself
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Note: full session validation happens server-side in the page/action.
  // The middleware only gates on cookie presence for a fast redirect.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
