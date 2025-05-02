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
  const response = NextResponse.next();

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Add COOP header
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  
  // Add other security headers
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-site');

  return response;
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
    '/api/:path*',
  ],
}; 