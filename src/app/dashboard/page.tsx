'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Github, Linkedin, FileText, Download, Moon, Sun, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Progress } from '@/components/ui/progress'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

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
                <Github className="h-5 w-5 text-green-500" />
                <span>GitHub connecté</span>
              </div>
              <div className="flex items-center gap-2">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
                <span>LinkedIn en attente</span>
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
              <Button className="w-full" variant="outline">
                <Github className="mr-2 h-4 w-4" />
                Synchroniser GitHub
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profil LinkedIn</CardTitle>
              <CardDescription>Ajoutez votre expérience professionnelle</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                <Linkedin className="mr-2 h-4 w-4" />
                Connecter LinkedIn
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
