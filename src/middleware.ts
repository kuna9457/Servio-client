import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/checkout',
  '/booking',
  '/payment',
  '/confirmation',
  '/profile',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;
  
  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    const url = new URL('/auth', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // Continue to the requested page
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/checkout/:path*',
    '/booking/:path*',
    '/payment/:path*',
    '/confirmation/:path*',
    '/profile/:path*',
  ],
}; 