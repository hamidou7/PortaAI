import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

export async function middleware(req: NextRequest) {
  console.log(' [Middleware] Route demandée:', req.nextUrl.pathname)
  
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Vérifie la session via les cookies
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  console.log(' [Middleware] État de la session:', {
    isAuthenticated: !!session,
    userId: session?.user?.id,
    email: session?.user?.email,
  })

  // Rafraîchit le token d'accès si nécessaire
  const { data: { user } } = await supabase.auth.getUser()
  console.log(' [Middleware] Données utilisateur:', {
    userId: user?.id,
    email: user?.email,
    metadata: user?.user_metadata
  })

  // Si l'utilisateur n'est pas authentifié et essaie d'accéder à /dashboard
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    console.log(' [Middleware] Accès non autorisé au dashboard, redirection vers /login')
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Si l'utilisateur est authentifié et essaie d'accéder à /login
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/')) {
    console.log(' [Middleware] Utilisateur déjà connecté, redirection vers /dashboard')
    const redirectUrl = new URL('/dashboard', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  console.log(' [Middleware] Passage autorisé pour:', req.nextUrl.pathname)
  return res
}

// Spécifie les routes à protéger
export const config = {
  matcher: ['/', '/dashboard/:path*', '/login']
}