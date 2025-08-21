import { auth } from "./app/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const { nextUrl, auth } = req;
  const isLoggedIn = !!auth;

  // Allow access to login page and API routes
  const isLoginPage = nextUrl.pathname.startsWith("/login");
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  
  // If the user is not logged in and trying to access a protected route
  if (!isLoggedIn && !isLoginPage && !isApiAuthRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // If the user is logged in and trying to access the login page
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

// Ensure middleware runs on all routes except static files
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
