import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // In Next.js App Router, cookies are the most reliable way to read tokens in middleware
  const token = request.cookies.get('token')?.value; 
  const path = request.nextUrl.pathname;

  // If there's no token and they are trying to access a protected route, boot them to login
  if (!token && (path.startsWith('/admin') || path.startsWith('/teacher') || path.startsWith('/student'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Note: For true role checking in middleware without a heavy JWT library, 
  // you often store the user's role in a separate plain text cookie during login, 
  // or use an edge-compatible JWT decoder.
  
  const role = request.cookies.get('role')?.value;

  if (path.startsWith('/admin') && role !== 'Admin') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (path.startsWith('/teacher') && role !== 'Teacher') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (path.startsWith('/student') && role !== 'Student') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Specify which paths this middleware should run on
export const config = {
  matcher: ['/admin/:path*', '/teacher/:path*', '/student/:path*'],
};
