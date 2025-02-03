import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <div className="text-center max-w-2xl mx-auto text-foreground">
        <h1 className="text-5xl font-bold leading-tight mb-6 tracking-wide">
          Créez votre portfolio pro en 5 minutes 🤖
        </h1>
        <p className="text-lg mb-8 text-muted-foreground">
          Utilisez l'IA pour générer un portfolio optimisé à partir de vos profils GitHub et LinkedIn.
        </p>
        <Link href="/login">
          <Button
            variant="default"
            size="lg"
            className="px-12 py-4 text-xl rounded-full shadow-lg transition-all hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
          >
            Commencer maintenant →
          </Button>
        </Link>
      </div>
    </main>
  )
}
