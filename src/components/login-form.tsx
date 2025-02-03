"use client"

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false); // État de chargement

  useEffect(() => {
    // Vérifier si l'URL contient un token d'accès
    const urlParams = new URLSearchParams(window.location.hash.substring(1)); // Récupère après "#"
    const accessToken = urlParams.get('access_token');
console.log(accessToken);

    if (accessToken) {
      // Stocker le token dans localStorage ou cookies
      localStorage.setItem('github_access_token', accessToken);
      // Rediriger vers une autre page
      window.location.href = '/dashboard'; // Change selon ton besoin
    }
  }, []);

  // Fonction pour gérer la connexion via GitHub ou LinkedIn
  const handleLogin = async (provider: "github" | "linkedin") => {
    setLoading(true);

    // Connexion OAuth avec Supabase
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
    });

    if (error) {
      console.error(`Erreur de connexion avec ${provider}:`, error.message);
      alert(`Erreur de connexion avec ${provider}: ${error.message}`);
    } else {
      // Supabase devrait ouvrir automatiquement la fenêtre d'autorisation
      console.log("Connexion réussie !");
    }

    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenue</CardTitle>
          <CardDescription>Connectez-vous avec votre compte GitHub ou LinkedIn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleLogin("github")}
              disabled={loading}
            >
              <Github size={20} /> Se connecter avec GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleLogin("linkedin")}
              disabled={loading}
            >
              <Linkedin size={20} /> Se connecter avec LinkedIn
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-sm">
        Vous n&apos;avez pas de compte ?{" "}
        <a href="/signup" className="underline underline-offset-4">
          Inscrivez-vous
        </a>
      </div>
    </div>
  );
}
