import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const searchParams = new URLSearchParams(requestUrl.search)
    const code = searchParams.get('code')
    const next = searchParams.get('next') || '/dashboard'
    
    console.log(' [Callback] Paramètres reçus:', {
      hasCode: !!code,
      next,
      fullUrl: request.url
    })

    if (code) {
      const cookieStore = await cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: any) {
              cookieStore.set({
                name,
                value,
                ...options
              })
            },
            remove(name: string, options: any) {
              cookieStore.delete({
                name,
                ...options
              })
            },
          },
        }
      )
      
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
      
      console.log(' [Callback] Échange de code:', {
        success: !!session,
        error: error?.message,
        userId: session?.user?.id
      })

      if (error) {
        console.error(' [Callback] Erreur:', error.message)
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url))
      }

      if (session) {
        console.log(' [Callback] Session créée, redirection vers:', next)
        return NextResponse.redirect(new URL(next, request.url))
      }
    }

    console.warn(' [Callback] Pas de code trouvé')
    return NextResponse.redirect(new URL('/login?error=no_code', request.url))
  } catch (error) {
    console.error(' [Callback] Erreur inattendue:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorMessage)}`, request.url))
  }
}
