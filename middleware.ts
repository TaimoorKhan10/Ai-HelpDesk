import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/api/tickets',
  '/api/knowledge',
  '/api/chats',
];

// Define paths that are accessible without authentication
const publicPaths = ['/', '/login', '/register', '/api/auth', '/api/ai/quick-response'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  // If it's not a protected path, continue
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Get the token from the cookies
  const token = request.cookies.get('auth_token')?.value;

  // If there's no token and the path is protected, redirect to login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  try {
    // Verify the token
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'default_secret')
    );
    
    // If the token is valid, continue
    return NextResponse.next();
  } catch (error) {
    // If the token is invalid, redirect to login
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  // Define paths that should trigger the middleware
  matcher: [
    /*
     * Match all paths except for:
     * - Static files (/_next, /images, /favicon.ico, etc.)
     */
    '/((?!_next/static|_next/image|images|favicon.ico).*)',
  ],
}; 