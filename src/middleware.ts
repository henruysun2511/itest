import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Helper function to decode JWT payload in edge runtime
function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl

  // Define path groups
  const isAuthPath = pathname.startsWith('/auth')
  const isAdminPath = pathname.startsWith('/admin')
  const isTeacherPath = pathname.startsWith('/teacher')
  const isStudentPath = pathname.startsWith('/student')

  // 1. Guarding Authentication Pages
  if (isAuthPath && token) {
    const decoded = decodeJwt(token)
    if (decoded?.roleName) {
      const role = decoded.roleName.toLowerCase()
      // Redirect to specific role dashboard
      return NextResponse.redirect(new URL(`/${role}`, request.url))
    }
  }

  // 2. Guarding Protected Routes
  if (isAdminPath || isTeacherPath || isStudentPath) {
    if (!token) {
      // Not logged in, redirect to login
      const loginUrl = new URL('/auth/login', request.url)
      // Optional: add callback URL
      // loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const decoded = decodeJwt(token)
    if (!decoded || !decoded.roleName) {
      // Invalid token, clear and go to login
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('accessToken')
      return response
    }

    const userRole = decoded.roleName.toUpperCase()

    // 3. Enforce RBAC
    if (isAdminPath && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/${userRole.toLowerCase()}`, request.url))
    }
    if (isTeacherPath && userRole !== 'TEACHER') {
      return NextResponse.redirect(new URL(`/${userRole.toLowerCase()}`, request.url))
    }
    if (isStudentPath && userRole !== 'STUDENT') {
      return NextResponse.redirect(new URL(`/${userRole.toLowerCase()}`, request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*',
    '/teacher/:path*',
    '/student/:path*',
    '/auth/:path*',
  ],
}
