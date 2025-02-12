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
import { generatePortfolioContent } from '@/lib/openai'


export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  const [loading, setLoading] = useState<"github" | "linkedin_oidc" | null>(null)
  const [connectedProviders, setConnectedProviders] = useState<string[]>([])
  const [hasCVData, setHasCVData] = useState(false)

  useEffect(() => {
    const checkConnectedProviders = async () => {
      if (!user) {
        console.log("❌ No user found")
        return
      }

      console.log("🔍 Checking providers for user:", user.id)

      try {
        const [profileData, cvData] = await Promise.all([
          supabase.from('profiles').select().eq('id', user.id).single(),
          supabase.from('cv_data').select().eq('user_id', user.id).single()
        ])

        if (profileData.error) {
          console.error("❌ Error fetching profile:", profileData.error)
          return
        }

        console.log("📊 Profile data:", profileData.data)

        if (profileData.data) {
          const providers = []
          if (profileData.data.github_url) providers.push('github')
          if (profileData.data.linkedin_url) providers.push('linkedin_oidc')
          console.log('✅ Connected providers:', providers)
          setConnectedProviders(providers)
        } else {
          console.log("❌ No profile found for user:", user.id)
        }

        // Check if CV data exists
        setHasCVData(!cvData.error && cvData.data !== null)
      } catch (error) {
        console.error("❌ Unexpected error:", error)
      }
    }

    checkConnectedProviders()
  }, [user])


  const handleLogin = async (provider: "github" | "linkedin_oidc") => {
    try {
      setLoading(provider);
  
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: provider === 'github' ? 'repo read:user user:email' : 'r_liteprofile r_emailaddress',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
  
      if (error) throw error;
  
      // Mettre à jour le profil après connexion
      if (data?.user) {
        const { data: userData } = await supabase
          .from('profiles')
          .update({
            [provider === 'github' ? 'github_data' : 'linkedin_data']: data.user.user_metadata,
            [provider === 'github' ? 'github_username' : 'linkedin_username']: data.user.user_metadata.user_name
          })
          .eq('id', data.user.id)
          .select();
      }
  
    } catch (error) {
      console.error('Erreur de connexion:', error);
      alert(`Erreur lors de la connexion ${provider}`);
    } finally {
      setLoading(null);
    }
  };
  const handleAIGeneration = async () => {
    try {
      if (!user) {
        alert('Veuillez vous connecter avant de générer un portfolio');
        return;
      }
  
      // 1. Récupération des données avec le bon typage
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select(`
          *,
          github_data,
          linkedin_data,
          cv_data (
            id,
            cv_data,
            updated_at
          )
        `)
        .eq('id', user.id)
        .single();
  
      if (fetchError || !data) throw new Error(fetchError?.message || 'Aucune donnée trouvée');
  
      // 2. Vérification du CV
      const cvData = data.cv_data;
      if (!cvData || cvData.length === 0) {
        throw new Error('Aucun CV trouvé - Veuillez uploader un CV');
      }
  
      // 3. Génération IA avec les données validées
      const generatedContent = await generatePortfolioContent({
        ...data,
        cv_data: cvData[0]
      });
  
      // 4. Sauvegarde avec vérification de type
      const { error: upsertError } = await supabase
        .from('portfolios')
        .upsert({
          user_id: user.id,
          generated_content: generatedContent,
          edited_content: null,
          ai_model: 'gpt-4-turbo',
          status: 'draft',
          cv_data_id: cvData[0].id // Accès au premier élément du array
        });
  
      if (upsertError) throw upsertError;
  
      window.location.href = `/dashboard/editor`;
  
    } catch (error) {
      console.error("Erreur de génération IA:", error);
      alert(`Erreur lors de la génération: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

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
            <Progress
              value={((connectedProviders.length + (hasCVData ? 1 : 0)) / 3) * 100}
              className="mb-2"
            />
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
                <FileText className={`h-5 w-5 ${hasCVData ? 'text-green-500' : 'text-muted-foreground'}`} />
                <span>{hasCVData ? 'CV complété' : 'CV en attente'}</span>
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

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Gérez votre profil et vos documents</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/dashboard/cv'}>
              <FileText className="mr-2 h-4 w-4" />
              Gérer mon CV
            </Button>
          </CardContent>
        </Card>

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

        <Card>
          <CardHeader>
            <CardTitle>Génération IA</CardTitle>
            <CardDescription>Générez votre contenu optimisé</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => handleAIGeneration()}
              disabled={connectedProviders.length < 1 && !hasCVData}
            >
              ✨ Générer mon portfolio avec l'IA
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
