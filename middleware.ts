import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { nextUrl, nextauth } = req;
    const isLoggedIn = !!nextauth.token;

    // Allow access to login page and API routes
    const isLoginPage = nextUrl.pathname.startsWith("/login");
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");

    // If the user is logged in and trying to access the login page
    if (isLoggedIn && isLoginPage) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to login page and API routes
        if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
          return true;
        }

        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

// Define which routes to run the middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes for authentication)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
