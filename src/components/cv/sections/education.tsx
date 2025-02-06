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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { X } from "lucide-react"
import { CVFormValues } from "../cv-form"

interface EducationFormProps {
  control: Control<CVFormValues>
}

export function EducationForm({ control }: EducationFormProps) {
  const { fields, append, remove } = useFieldArray({
    name: "education",
    control,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="relative space-y-4 rounded-lg border p-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>

            <FormField
              control={control}
              name={`education.${index}.school`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>École</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`education.${index}.degree`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diplôme</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`education.${index}.field`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domaine d'études</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`education.${index}.startDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <DatePicker
                        control={control}
                        name={`education.${index}.startDate`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`education.${index}.endDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin</FormLabel>
                    <FormControl>
                      <DatePicker
                        control={control}
                        name={`education.${index}.endDate`}
                        placeholder="En cours"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name={`education.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() =>
            append({
              school: "",
              degree: "",
              field: "",
              startDate: new Date(),
              description: "",
            })
          }
        >
          Ajouter une formation
        </Button>
      </CardContent>
    </Card>
  )
}
