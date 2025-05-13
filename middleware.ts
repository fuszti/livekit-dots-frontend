import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path.startsWith('/api/auth');
  
  // Check if the user is authenticated
  const isAuthenticated = request.cookies.has('auth');

  // Redirect logic
  if (!isAuthenticated && !isPublicPath) {
    // Redirect unauthenticated users to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && path === '/login') {
    // Redirect authenticated users trying to access login to home page
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Match all routes except for static files, api routes that aren't auth-related
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (login API endpoint)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 