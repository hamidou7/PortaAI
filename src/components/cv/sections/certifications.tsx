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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { X } from "lucide-react"

interface CertificationsFormProps {
  control: Control<any>
}

export function CertificationsForm({ control }: CertificationsFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Certifications</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "", issuer: "", date: null, url: "" })}
        >
          Ajouter une certification
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative">
            <Button
              type="button"
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
                name={`certifications.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la certification</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: AWS Solutions Architect" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`certifications.${index}.issuer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organisme certificateur</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Amazon Web Services" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`certifications.${index}.date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'obtention</FormLabel>
                    <FormControl>
                      <DatePicker
                        control={control}
                        name={`certifications.${index}.date`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`certifications.${index}.url`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de vérification (optionnel)</FormLabel>
                    <FormControl>
                      <Input 
                        type="url" 
                        placeholder="https://www.credential.net/..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
