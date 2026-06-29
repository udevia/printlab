import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Only protect the /admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      // For Phase 1 (Guest Checkout without NextAuth), we use a hardcoded admin login
      // Username: admin, Password: password123
      if (user === 'admin' && pwd === 'password123') {
        return NextResponse.next();
      }
    }

    // Require authentication
    const url = req.nextUrl;
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

// Config ensures middleware only runs on /admin routes (and avoids running on API/static)
export const config = {
  matcher: ['/admin/:path*'],
};
