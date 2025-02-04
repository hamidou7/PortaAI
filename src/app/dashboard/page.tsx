'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Bienvenue, {user?.user_metadata.full_name || user?.email}
        </h1>
        <Button variant="outline" onClick={signOut}>
          Se déconnecter
        </Button>
      </div>
      
      {/* Contenu du dashboard */}
    </div>
  )
}
