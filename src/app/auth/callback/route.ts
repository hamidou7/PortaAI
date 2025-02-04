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
      
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error('Error exchanging code for session:', error.message)
        return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
      }

      // Get the user after exchange
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id)
          .single()

        if (!existingProfile) {
          // Get provider from user metadata
          const provider = user.app_metadata.provider

          // Create new profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: user.user_metadata.user_name || user.user_metadata.preferred_username || user.email?.split('@')[0] || 'user_' + user.id,
              github_url: provider === 'github' ? user.user_metadata.user_name : null,
              linkedin_url: provider === 'linkedin' ? user.user_metadata.user_name : null,
            })

          if (profileError) {
            console.error('Error creating profile:', profileError.message)
            return NextResponse.redirect(`${requestUrl.origin}/auth/profile-error`)
          }
          console.log('✅ Profile created successfully')
        }
      }

      console.log(' [Callback] Session créée, redirection vers:', next)
      return NextResponse.redirect(requestUrl.origin + next)
    }

    console.warn(' [Callback] Pas de code trouvé')
    return NextResponse.redirect(new URL('/login?error=no_code', request.url))
  } catch (error) {
    console.error(' [Callback] Erreur inattendue:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorMessage)}`, request.url))
  }
}
