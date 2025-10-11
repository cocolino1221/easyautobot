import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/conversations',
  '/integrations',
  '/flows',
  '/analytics',
  '/settings',
];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/signin', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get access token from localStorage (check via cookie or header)
  const accessToken = request.cookies.get('access_token')?.value;

  // Check if trying to access protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if on auth page
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Redirect to signin if accessing protected route without token
  if (isProtectedRoute && !accessToken) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if already authenticated and on auth page
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|$).*)',
  ],
};
