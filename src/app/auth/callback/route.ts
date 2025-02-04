import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface Profile {
  id: string;
  email: string | null;
  bio: string | null;
  username?: string;
  avatar_url?: string;
  github_url?: string | null;
  linkedin_url?: string | null;
}

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

      console.log("user",user);
      
      if (user) {
        console.log("👤 Processing user:", user.id)
        
        try {
          // First, try to find any existing profile for this user
          const { data: existingProfile, error: existingProfileError } = await supabase
            .from('profiles')
            .select()
            .eq('id', user.id)
            .single()

          if (existingProfileError && existingProfileError.code !== 'PGRST116') {
            console.error("❌ Error checking existing profile:", existingProfileError)
            return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
          }

          console.log("🔍 Existing profile:", existingProfile)

          // Also check if there's a profile with any of the user's identities
          const { data: identityProfile, error: identityProfileError } = await supabase
            .from('profiles')
            .select()
            .or(`github_url.neq.null,linkedin_url.neq.null`)
            .single()

          if (identityProfileError && identityProfileError.code !== 'PGRST116') {
            console.error("❌ Error checking identity profile:", identityProfileError)
            return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
          }

          console.log("🔍 Identity profile:", identityProfile)

          // Get provider from user metadata
          const provider = user.app_metadata.provider
          console.log("🔑 Provider:", provider)

          // Prepare profile data based on provider
          let profileData: Partial<Profile> = {}

          if (provider === 'github') {
            profileData = {
              username: user.user_metadata.preferred_username || user.user_metadata.user_name,
              avatar_url: user.user_metadata.avatar_url,
              github_url: `https://github.com/${user.user_metadata.user_name}`,
            }
          } else if (provider === 'linkedin_oidc') {
            profileData = {
              username: user.user_metadata.name?.toLowerCase().replace(/\s+/g, '_') || user.email?.split('@')[0],
              avatar_url: user.user_metadata.picture,
              linkedin_url: `https://www.linkedin.com/in/${user.user_metadata.sub}`,
            }
          }

          console.log("📝 Profile data to save:", profileData)

          // If we found an existing profile with other identities, update it
          if (identityProfile && !existingProfile) {
            console.log("🔄 Updating existing identity profile")
            // Update the existing profile with the new provider data
            const { error: updateError } = await supabase
              .from('profiles')
              .update(profileData)
              .eq('id', identityProfile.id)

            if (updateError) {
              console.error('❌ Error updating profile:', updateError)
              return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
            }
            console.log("✅ Profile updated successfully")
          } else if (!existingProfile) {
            console.log("➕ Creating new profile")
            // Create new profile if no existing profile found
            const newProfileData = {
              id: user.id,
              email: user.user_metadata.email,
              bio: null,
              ...profileData
            }
            console.log("📝 New profile data:", newProfileData)

            const { error: profileError } = await supabase
              .from('profiles')
              .insert(newProfileData)

            if (profileError) {
              console.error('❌ Error creating profile:', profileError)
              return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
            }
            console.log("✅ Profile created successfully")
          } else {
            console.log("🔄 Updating existing profile")
            // Update existing profile with new provider data
            const { error: updateError } = await supabase
              .from('profiles')
              .update(profileData)
              .eq('id', existingProfile.id)

            if (updateError) {
              console.error('❌ Error updating profile:', updateError)
              return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
            }
            console.log("✅ Profile updated successfully")
          }
        } catch (error) {
          console.error("❌ Unexpected error:", error)
          return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
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
