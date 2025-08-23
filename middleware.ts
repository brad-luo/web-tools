import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { nextUrl, nextauth } = req;
    const isLoggedIn = !!nextauth.token;

    // Allow access to login page and API routes
    const isLoginPage = nextUrl.pathname.startsWith("/login");

    // If the user is logged in and trying to access the login page
    if (isLoggedIn && isLoginPage) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to login page and API routes
        if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
          return true;
        }

        // Allow access to all routes (login is now optional)
        return true;
      },
    },
  }
);

// Define which routes to run the middleware on (only for login redirect logic)
export const config = {
  matcher: [
    /*
     * Match only login page to handle redirect logic
     */
    '/login',
  ],
};
