import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that should redirect authenticated users away
const publicRoutes = ['/login', '/register', '/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is a public auth route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Get auth token from cookie (set by API)
  const token = request.cookies.get('auth_token')?.value

  // If accessing login/register page while already authenticated, redirect to account
  if (isPublicRoute && token) {
    const url = request.nextUrl.clone()
    url.pathname = '/account'
    // Preserve query parameters (especially ref code for affiliate tracking)
    url.search = request.nextUrl.search
    return NextResponse.redirect(url)
  }

  // For protected routes, let the client-side AuthContext handle authentication
  // This avoids cross-domain cookie issues
  // Preserve query parameters for affiliate tracking
  const response = NextResponse.next()
  
  // Log affiliate ref parameter if present for debugging
  const refParam = request.nextUrl.searchParams.get('ref')
  if (refParam) {
    console.log('🎯 Middleware detected ref parameter:', refParam, 'on path:', pathname)
  }
  
  return response
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
