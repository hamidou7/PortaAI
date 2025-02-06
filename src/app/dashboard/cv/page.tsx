'use client'

import { useAuth } from '@/hooks/useAuth'
import { CVForm } from '@/components/cv/cv-form'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { CVFormValues } from '@/components/cv/cv-form'

export default function CVPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [initialData, setInitialData] = useState<Partial<CVFormValues>>()
  useEffect(() => {
    const loadCVData = async () => {
      if (!user) return;

      console.log("🔍 Vérification des données Supabase...");

      const { data, error } = await supabase
        .from('cv_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log("📤 Réponse brute de Supabase:", { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error('⚠️ Erreur lors du chargement des données:', error);
        return;
      }

      if (data?.cv_data) {
        console.log("✅ Données existantes trouvées");
        setInitialData(data.cv_data as Partial<CVFormValues>);
      } else {
        console.log("⚠️ Aucune donnée trouvée, initialisation vide.");
        setInitialData({});
      }
    };

    loadCVData();
  }, [user]);

  const convertDatesToISOString = (data: CVFormValues) => {
    const convertedData = {
      ...data,
      education: data.education.map(edu => ({
        ...edu,
        startDate: edu.startDate.toISOString(),
        endDate: edu.endDate?.toISOString(),
      })),
      experience: data.experience.map(exp => ({
        ...exp,
        startDate: exp.startDate.toISOString(),
        endDate: exp.endDate?.toISOString(),
      })),
      certifications: data.certifications.map(cert => ({
        ...cert,
        date: cert.date.toISOString(),
      })),
    }
    console.log("📅 Données APRÈS conversion date:", convertedData)

    return convertedData
  }

  const handleSubmit = async (data: CVFormValues) => {
    if (!user) {
      console.log('❌ No user found');
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder votre CV",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("🔍 Recherche d'un CV existant...");
      const { data: existingData } = await supabase
        .from('cv_data')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const convertedData = convertDatesToISOString(data);
      console.log("📝 Données à sauvegarder:", convertedData);

      let error;
      if (existingData) {
        console.log("🔄 Mise à jour du CV existant...");
        ({ error } = await supabase
          .from('cv_data')
          .update({
            cv_data: convertedData,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id));
      } else {
        console.log("➕ Création d'un nouveau CV...");
        ({ error } = await supabase
          .from('cv_data')
          .insert({
            user_id: user.id,
            cv_data: convertedData,
            updated_at: new Date().toISOString(),
          }));
      }

      if (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la sauvegarde du CV",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ CV sauvegardé avec succès');
      toast({
        title: "Succès",
        description: "Votre CV a été sauvegardé avec succès",
      });
    } catch (error) {
      console.error('❌ Erreur inattendue:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto p-4">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Mon CV</h1>
        <CVForm
          initialData={initialData}
          onSubmit={async (data) => {
            console.log("📩 Page CV: Début de onSubmit");
            console.log("📦 Page CV: Données reçues:", data);
            try {
              console.log("🔄 Page CV: Appel de handleSubmit");
              await handleSubmit(data);
              console.log("✅ Page CV: handleSubmit terminé avec succès");
            } catch (error) {
              console.error("❌ Page CV: Erreur dans handleSubmit:", error);
              throw error; // Propager l'erreur au composant CVForm
            }
          }}
        />
      </div>
    </div>
  )
}
