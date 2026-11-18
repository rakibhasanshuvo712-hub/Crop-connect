import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cropconnect-demo.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key'

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }: any) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }: any) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {}

  // Check fallback session cookie
  const userCookie = request.cookies.get('cropconnect_user')?.value
  let localUser: any = null
  if (userCookie) {
    try {
      localUser = JSON.parse(userCookie)
    } catch {}
  }

  const activeUser = user || localUser
  const { pathname } = request.nextUrl

  // Protected paths
  const isFarmerRoute = pathname.startsWith('/farmer')
  const isBuyerRoute = pathname.startsWith('/buyer')
  const isAdminRoute = pathname.startsWith('/admin')

  if ((isFarmerRoute || isBuyerRoute || isAdminRoute) && !activeUser) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect logged-in users away from auth pages
  if (activeUser && (pathname === '/auth/login' || pathname === '/auth/register')) {
    if (activeUser.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } else if (activeUser.role === 'farmer') {
      return NextResponse.redirect(new URL('/farmer/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/buyer/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
