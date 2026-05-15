import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasSession = request.cookies.getAll().some(
    (c) => c.name.startsWith('sb-') && c.name.includes('auth-token')
  )

  if (!hasSession && pathname !== '/login' && !pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (hasSession && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
