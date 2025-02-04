'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Github, Linkedin, FileText, Download, Moon, Sun, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'

interface Profile {
  id: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  connected_providers: string[] | null;
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  const [loading, setLoading] = useState<"github" | "linkedin_oidc" | null>(null)
  const [connectedProviders, setConnectedProviders] = useState<string[]>([])
  useEffect(() => {
    const checkConnectedProviders = async () => {
      if (!user) {
        console.log("❌ No user found")
        return
      }

      console.log("🔍 Checking providers for user:", user.id)
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id)
          .single()

        if (error) {
          console.error("❌ Error fetching profile:", error)
          return
        }

        console.log("📊 Profile data:", data)

        if (data) {
          const providers = []
          if (data.github_url) providers.push('github')
          if (data.linkedin_url) providers.push('linkedin_oidc')
          console.log('✅ Connected providers:', providers)
          setConnectedProviders(providers)
        } else {
          console.log("❌ No profile found for user:", user.id)
        }
      } catch (error) {
        console.error("❌ Unexpected error:", error)
      }
    }

    checkConnectedProviders()
  }, [user])


  const handleLogin = async (provider: "github" | "linkedin_oidc") => {
    try {
      console.log('🚀 [LoginForm] Tentative de connexion avec:', provider)
      setLoading(provider)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: provider === 'github' ? 'repo read:user user:email' : ''
        }
      })

      console.log('📋 [LoginForm] Réponse OAuth:', {
        error: error?.message,
        provider,
        url: data?.url,
        hasData: !!data
      })

      if (error) throw error

      console.log('✅ [LoginForm] Redirection OAuth initiée')
    } catch (error) {
      console.error('❌ [LoginForm] Erreur de connexion:', {
        provider,
        error,
      })
      alert(`Erreur de connexion avec ${provider}. Veuillez réessayer.`)
    } finally {
      setLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec profil et actions */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.user_metadata.avatar_url} />
              <AvatarFallback>{user?.user_metadata.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{user?.user_metadata.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="outline" onClick={() => signOut()}>
              Se déconnecter
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto p-6 space-y-6">
        {/* Progression du profil */}
        <Card>
          <CardHeader>
            <CardTitle>Progression du Portfolio</CardTitle>
            <CardDescription>Complétez les étapes pour générer votre portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={33} className="mb-2" />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Github className={`h-5 w-5 ${connectedProviders.includes('github') ? 'text-green-500' : 'text-muted-foreground'}`} />
                <span>{connectedProviders.includes('github') ? 'GitHub connecté' : 'GitHub en attente'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Linkedin className={`h-5 w-5 ${connectedProviders.includes('linkedin_oidc') ? 'text-green-500' : 'text-muted-foreground'}`} />
                <span>{connectedProviders.includes('linkedin_oidc') ? 'LinkedIn connecté' : 'LinkedIn en attente'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span>CV en attente</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions principales */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Données GitHub</CardTitle>
              <CardDescription>Importez vos projets et contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleLogin("github")}
                disabled={loading !== null || connectedProviders.includes('github')}
              >
                <Github className="mr-2 h-4 w-4" />
                {connectedProviders.includes('github') ? 'GitHub Synchronisé' : 'Synchroniser GitHub'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profil LinkedIn</CardTitle>
              <CardDescription>Ajoutez votre expérience professionnelle</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" onClick={() => handleLogin("linkedin_oidc")}
                disabled={loading !== null || connectedProviders.includes('linkedin_oidc')}
              >
                <Linkedin className="mr-2 h-4 w-4" />
                {connectedProviders.includes('linkedin_oidc') ? 'LinkedIn Connecté' : 'Connecter LinkedIn'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exporter</CardTitle>
              <CardDescription>Téléchargez votre portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exporter en PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Personnalisation */}
        <Card>
          <CardHeader>
            <CardTitle>Personnalisation</CardTitle>
            <CardDescription>Configurez l'apparence de votre portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Button variant="outline" className="justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Thèmes et Couleurs
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Modèles de Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
