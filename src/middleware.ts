import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.delete({
            name,
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  // IMPORTANT: Ne pas exécuter de code entre createServerClient et auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

 

  // Si l'utilisateur n'est pas authentifié et essaie d'accéder à /dashboard
  if (
    !user &&
    req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Si l'utilisateur est authentifié et essaie d'accéder à /login ou la racine
  if (user && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Ajoute les headers de sécurité
  res.headers.set('x-frame-options', 'DENY')
  res.headers.set('x-content-type-options', 'nosniff')
  res.headers.set('x-xss-protection', '1; mode=block')

  console.log(` [Middleware] Passage autorisé pour: ${req.nextUrl.pathname}`)
  return res
}

// Spécifie les routes à protéger
export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/auth/callback']
}