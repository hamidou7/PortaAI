import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/auth-helpers-nextjs'
import { supabase } from '@/utils/supabase/client'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError) {
          console.error(' [useAuth] Erreur lors de la récupération de l\'utilisateur:', userError)
          throw userError
        }

        if (user) {
          setUser(user)
          console.log(' [useAuth] Utilisateur authentifié:', user)
        } else {
          console.log(' [useAuth] Pas d\'utilisateur actif, redirection vers /login')
          setUser(null)
          router.push('/login')
        }
      } catch (error) {
        console.error(' [useAuth] Erreur lors de la vérification de l\'authentification:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    // Vérifie l'utilisateur initial
    checkUser()

    // Écoute les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(' [useAuth] Changement d\'état d\'authentification:', {
          event,
          userId: session?.user?.id,
          email: session?.user?.email
        })

        if (session) {
          setUser(session.user)
          console.log(' [useAuth] Utilisateur connecté')
        } else {
          setUser(null)
          console.log(' [useAuth] Utilisateur déconnecté, redirection vers /login')
          router.push('/login')
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const signOut = async () => {
    try {
      console.log(' [useAuth] Tentative de déconnexion...')
      await supabase.auth.signOut()
      console.log(' [useAuth] Déconnexion réussie')
      router.push('/login')
    } catch (error) {
      console.error(' [useAuth] Erreur lors de la déconnexion:', error)
    }
  }

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user
  }
}
