import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware without authentication for demo
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Authentication disabled for demo
// To enable Clerk auth: Add keys to .env.local and use clerkMiddleware

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
