import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { GithubIcon, LinkedinIcon, ArrowRight } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-background/95 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-primary/5 via-primary/5 to-transparent" />
      
      <div className="relative text-center max-w-3xl mx-auto text-foreground space-y-8">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Créez votre portfolio pro<br />en 5 minutes
            </span>
            <span className="ml-2">🚀</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Utilisez l'IA pour générer un portfolio optimisé à partir de vos profils GitHub et LinkedIn.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <Link href="/login">
            <Button
              size="lg"
              className="group px-8 py-6 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <GithubIcon className="h-5 w-5" />
            <span>+</span>
            <LinkedinIcon className="h-5 w-5" />
            <span className="ml-1">= Portfolio professionnel</span>
          </div>
        </div>
      </div>
    </main>
  )
}
