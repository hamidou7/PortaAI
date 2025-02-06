"use client"

import { Control } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PersonalInfoFormProps {
  control: Control<any>
}

export function PersonalInfoForm({ control }: PersonalInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations Personnelles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="personalInfo.fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+33 6 12 34 56 78" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Localisation</FormLabel>
              <FormControl>
                <Input placeholder="Paris, France" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre professionnel</FormLabel>
              <FormControl>
                <Input placeholder="Développeur Full Stack" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Résumé professionnel</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Bref résumé de votre profil et de vos objectifs professionnels" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
