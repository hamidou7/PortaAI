import { SupabaseClient, Session, UserMetadata } from '@supabase/supabase-js'

// Généré avec la commande : npx supabase gen types typescript > src/types/supabase.ts
import { Database } from '../types/supabase'

declare global {
  interface Window {
    supabase: SupabaseClient<Database>
  }

  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    }
  }
}

declare module '@supabase/supabase-js' {
  interface UserMetadata {
    id: string;
    username: string;
    name?: string | null;
    email?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    github_url?: string | null;
    linkedin_url?: string | null;
    created_at?: string | null;
  }
}
