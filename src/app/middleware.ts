import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { paths } from '@/paths';
export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  // Check if the token exists
  if (token) {
    // Redirect to dashboard if user is authenticated and trying to access auth routes
    if (request.nextUrl.pathname === paths.login ||
        request.nextUrl.pathname === paths.auth.signIn ||
        request.nextUrl.pathname === paths.auth.signUp ||
        request.nextUrl.pathname === paths.auth.resetPassword ||
        request.nextUrl.pathname === paths.home) {
      return NextResponse.redirect(new URL(paths.dashboard.overview, request.url));
    }
  } else {
    // Redirect to login if user is not authenticated and trying to access dashboard routes
    if (request.nextUrl.pathname.startsWith(paths.dashboard.overview)) {
      return NextResponse.redirect(new URL(paths.login, request.url));
    }
  }

  // Continue with the request if no redirects are required
  return NextResponse.next();
}

// Apply the middleware to specific routes
export const config = {
  matcher: [
    paths.home,
    paths.login,
    paths.auth.signIn,
    paths.auth.signUp,
    paths.auth.resetPassword,
    paths.dashboard.overview,
    paths.dashboard.account,
    paths.dashboard.customers,
    paths.dashboard.integrations,
    paths.dashboard.settings,
  ],
};