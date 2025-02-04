'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Github } from 'lucide-react'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()

  console.log("user",user);
  

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.user_metadata.avatar_url} />
            <AvatarFallback>{user?.user_metadata.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              Bienvenue, {user?.user_metadata.full_name || user?.user_metadata.name}
            </h1>
            <p className="text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={signOut}>
          Se déconnecter
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              Profil GitHub
            </CardTitle>
            <CardDescription>Informations de votre compte GitHub</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm font-medium">Nom d'utilisateur:</span>
              <p className="text-muted-foreground">{user?.user_metadata.preferred_username}</p>
            </div>
            <div>
              <span className="text-sm font-medium">ID GitHub:</span>
              <p className="text-muted-foreground">{user?.user_metadata.provider_id}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Compte créé le:</span>
              <p className="text-muted-foreground">
                {new Date(user?.created_at || '').toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>État de la session</CardTitle>
            <CardDescription>Détails de votre connexion actuelle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm font-medium">Dernière connexion:</span>
              <p className="text-muted-foreground">
                {new Date(user?.last_sign_in_at || '').toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Email vérifié:</span>
              <p className="text-muted-foreground">
                {user?.user_metadata.email_verified ? 'Oui' : 'Non'}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Type d'authentification:</span>
              <p className="text-muted-foreground capitalize">
                {user?.app_metadata.provider}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
