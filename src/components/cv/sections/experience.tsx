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
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"
import { CVFormValues } from "../cv-form"

interface ExperienceFormProps {
  control: Control<CVFormValues>
}

export function ExperienceForm({ control }: ExperienceFormProps) {
  const { fields, append, remove } = useFieldArray({
    name: "experience",
    control,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expérience professionnelle</CardTitle>
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
              name={`experience.${index}.company`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entreprise</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`experience.${index}.position`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poste</FormLabel>
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
                name={`experience.${index}.startDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <DatePicker
                        control={control}
                        name={`experience.${index}.startDate`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`experience.${index}.endDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin</FormLabel>
                    <FormControl>
                      <DatePicker
                        control={control}
                        name={`experience.${index}.endDate`}
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
              name={`experience.${index}.current`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Poste actuel</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`experience.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Décrivez vos responsabilités et réalisations..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`experience.${index}.technologies`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies utilisées</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value?.join(", ") || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .split(",")
                            .map((tech) => tech.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder="React, TypeScript, Node.js..."
                    />
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
              company: "",
              position: "",
              startDate: new Date(),
              current: false,
              description: "",
              technologies: [],
            })
          }
        >
          Ajouter une expérience
        </Button>
      </CardContent>
    </Card>
  )
}
