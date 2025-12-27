import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // 1. Check for the Authorization header
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    // Decode the Base64 username:password string
    const [user, pwd] = atob(authValue).split(':');

    // 2. Check if the password matches your environment variable

    if (pwd === process.env.SITE_PASSWORD) {
      return NextResponse.next();
    }
  }

  // 3. If no auth or wrong password, ask for it
  return new NextResponse('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

// 4. Matcher allows this to run on all pages
export const config = {
  matcher: '/:path*',
};