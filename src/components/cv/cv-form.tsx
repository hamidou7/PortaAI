"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { PersonalInfoForm } from "./sections/personal-info"
import { EducationForm } from "./sections/education"
import { ExperienceForm } from "./sections/experience"
import { SkillsForm } from "./sections/skills"
import { LanguagesForm } from "./sections/languages"
import { CertificationsForm } from "./sections/certifications"
import { useEffect } from "react"

const cvFormSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    phone: z.string().optional(),
    location: z.string().optional(),
    title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
    summary: z.string().optional(),
  }),
  education: z.array(z.object({
    school: z.string(),
    degree: z.string(),
    field: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    description: z.string().optional(),
  })),
  experience: z.array(z.object({
    company: z.string(),
    position: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    current: z.boolean().default(false),
    description: z.string(),
    technologies: z.array(z.string()).optional(),
  })),
  skills: z.array(z.object({
    name: z.string(),
    level: z.enum(["Débutant", "Intermédiaire", "Avancé", "Expert"]),
    category: z.string(),
  })),
  languages: z.array(z.object({
    language: z.string(),
    level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2", "Natif"]),
  })),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.date(),
    url: z.string().url().optional(),
  })),
})

export type CVFormValues = z.infer<typeof cvFormSchema>

export function CVForm({ initialData, onSubmit }: {
  initialData?: Partial<CVFormValues>
  onSubmit: (data: CVFormValues) => void
}) {
  console.log(" CVForm rendu avec initialData:", initialData);

  const form = useForm<CVFormValues>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      personalInfo: {
        fullName: initialData?.personalInfo?.fullName || "",
        email: initialData?.personalInfo?.email || "",
        phone: initialData?.personalInfo?.phone || "",
        location: initialData?.personalInfo?.location || "",
        title: initialData?.personalInfo?.title || "",
        summary: initialData?.personalInfo?.summary || "",
      },
      education: initialData?.education || [],
      experience: initialData?.experience || [],
      skills: initialData?.skills || [],
      languages: initialData?.languages || [],
      certifications: initialData?.certifications || [],
    },
  });

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(" Formulaire soumis");
    
    const formData = form.getValues();
    console.log(" Données du formulaire:", formData);

    try {
      console.log(" Appel de onSubmit...");
      await onSubmit(formData);
      console.log(" onSubmit terminé avec succès");
    } catch (error) {
      console.error(" Erreur dans onSubmit:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      console.log(" Mise à jour du formulaire avec:", initialData);
      form.reset(initialData, { keepDefaultValues: true });
    }
  }, [initialData]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmitHandler} className="space-y-8">
        <PersonalInfoForm control={form.control} />
        <EducationForm control={form.control} />
        <ExperienceForm control={form.control} />
        <SkillsForm control={form.control} />
        <LanguagesForm control={form.control} />
        <CertificationsForm control={form.control} />
        
        <Button 
          type="submit"
          onClick={() => console.log(" Bouton submit cliqué")}
        >
          Enregistrer le CV
        </Button>
      </form>
    </Form>
  )
}
