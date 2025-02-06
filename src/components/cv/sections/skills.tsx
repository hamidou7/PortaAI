"use client"

import { Control, useFieldArray } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface SkillsFormProps {
  control: Control<any>
}

const skillLevels = [
  "Débutant",
  "Intermédiaire",
  "Avancé",
  "Expert",
] as const

const defaultCategories = [
  "Langages de programmation",
  "Frameworks",
  "Bases de données",
  "DevOps",
  "Soft Skills",
  "Autres",
] as const

export function SkillsForm({ control }: SkillsFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compétences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardContent className="space-y-4 pt-6">
              <FormField
                control={control}
                name={`skills.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la compétence</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`skills.${index}.level`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un niveau" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {skillLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`skills.${index}.category`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {defaultCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              name: "",
              level: "Intermédiaire",
              category: "Autres",
            })
          }
        >
          Ajouter une compétence
        </Button>
      </CardContent>
    </Card>
  )
}
