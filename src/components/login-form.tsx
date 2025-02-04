"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Linkedin } from "lucide-react"
import { supabase } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState<"github" | "linkedin" | null>(null)
  const router = useRouter()

  const handleLogin = async (provider: "github" | "linkedin") => {
    try {
      console.log('🚀 [LoginForm] Tentative de connexion avec:', provider)
      setLoading(provider)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: provider === 'github' ? 'repo read:user user:email' : '',
          queryParams: provider === 'github' ? {
            access_type: 'offline',
            prompt: 'consent',
          } : undefined,
        }
      })

      console.log('📋 [LoginForm] Réponse OAuth:', {
        error: error?.message,
        provider,
        url: data?.url,
        hasData: !!data
      })

      if (error) throw error

      // Si nous avons une URL de redirection, redirigeons l'utilisateur
      if (data?.url) {
        console.log('✅ [LoginForm] Redirection vers:', data.url)
        window.location.href = data.url
      }
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

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Commençons ! 🚀</CardTitle>
          <CardDescription className="text-base">
            Choisissez une plateforme pour générer votre portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            className="w-full h-11 relative font-medium"
            onClick={() => handleLogin("github")}
            disabled={loading !== null}
          >
            <Github className="mr-2 h-5 w-5" />
            {loading === "github" ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-r-transparent" />
            ) : (
              "Continuer avec GitHub"
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 relative font-medium"
            onClick={() => handleLogin("linkedin")}
            disabled={loading !== null}
          >
            <Linkedin className="mr-2 h-5 w-5" />
            {loading === "linkedin" ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-r-transparent" />
            ) : (
              "Continuer avec LinkedIn"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
