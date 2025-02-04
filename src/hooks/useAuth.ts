import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User } from '@supabase/auth-helpers-nextjs'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Vérifie si nous avons une session active dans les cookies
    const checkUser = async () => {
      try {
        console.log(' [useAuth] Vérification de la session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error(' [useAuth] Erreur lors de la vérification de la session:', error)
          throw error
        }
        
        console.log(' [useAuth] Données de session:', {
          isAuthenticated: !!session,
          userId: session?.user?.id,
          email: session?.user?.email,
          metadata: session?.user?.user_metadata
        })
        
        if (session) {
          // Met à jour l'état avec les données de l'utilisateur
          setUser(session.user)
          console.log(' [useAuth] Session trouvée, utilisateur mis à jour')
          
          // Rafraîchit le cookie si nécessaire
          const { data: { user: refreshedUser }, error: refreshError } = await supabase.auth.getUser()
          if (refreshError) {
            console.error(' [useAuth] Erreur lors du rafraîchissement:', refreshError)
          } else {
            console.log(' [useAuth] Données utilisateur rafraîchies:', {
              userId: refreshedUser?.id,
              email: refreshedUser?.email
            })
          }
        } else {
          console.log(' [useAuth] Pas de session active, redirection vers /login')
          setUser(null)
          router.push('/login')
        }
      } catch (error) {
        console.error(' [useAuth] Erreur lors de la vérification de la session:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    // Vérifie la session initiale
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
      console.log(' [useAuth] Nettoyage des souscriptions')
      subscription.unsubscribe()
    }
  }, [router, supabase])

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
