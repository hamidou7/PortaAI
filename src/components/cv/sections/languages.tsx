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

interface LanguagesFormProps {
  control: Control<any>
}

const languageLevels = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
  "Natif",
] as const

export function LanguagesForm({ control }: LanguagesFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Langues</CardTitle>
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
                name={`languages.${index}.language`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Langue</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Français, Anglais, Espagnol..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`languages.${index}.level`}
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
                        {languageLevels.map((level) => (
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
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              language: "",
              level: "B2",
            })
          }
        >
          Ajouter une langue
        </Button>
      </CardContent>
    </Card>
  )
}
