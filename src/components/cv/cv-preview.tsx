"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface CVData {
  personalInfo: {
    fullName: string
    email: string
    phone?: string
    location?: string
    title: string
    summary?: string
  }
  education: Array<{
    school: string
    degree: string
    field: string
    startDate: Date
    endDate?: Date
    description?: string
  }>
  experience: Array<{
    company: string
    position: string
    startDate: Date
    endDate?: Date
    current: boolean
    description: string
    technologies?: string[]
  }>
  skills: Array<{
    name: string
    level: string
    category: string
  }>
  languages: Array<{
    language: string
    level: string
  }>
  certifications: Array<{
    name: string
    issuer: string
    date: Date
    url?: string
  }>
}

export function CVPreview({ data }: { data: CVData }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{data.personalInfo.fullName}</h1>
        <p className="text-xl text-muted-foreground">{data.personalInfo.title}</p>
        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>

      {/* Résumé */}
      {data.personalInfo.summary && (
        <Card>
          <CardHeader>
            <CardTitle>Résumé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{data.personalInfo.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Expérience */}
      <Card>
        <CardHeader>
          <CardTitle>Expérience Professionnelle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.experience.map((exp, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{exp.position}</h3>
                  <p className="text-muted-foreground">{exp.company}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(exp.startDate)} - {exp.current ? "Présent" : exp.endDate ? formatDate(exp.endDate) : ""}
                </p>
              </div>
              <p className="text-sm">{exp.description}</p>
              {exp.technologies && (
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Compétences */}
      <Card>
        <CardHeader>
          <CardTitle>Compétences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(
              data.skills.reduce((acc, skill) => {
                if (!acc[skill.category]) {
                  acc[skill.category] = []
                }
                acc[skill.category].push(skill)
                return acc
              }, {} as Record<string, typeof data.skills>)
            ).map(([category, skills]) => (
              <div key={category}>
                <h3 className="font-semibold mb-2">{category}</h3>
                <div className="space-y-1">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{skill.name}</span>
                      <span className="text-muted-foreground text-sm">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Langues */}
      <Card>
        <CardHeader>
          <CardTitle>Langues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {data.languages.map((lang, index) => (
              <div key={index} className="flex justify-between">
                <span>{lang.language}</span>
                <span className="text-muted-foreground">{lang.level}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.certifications.map((cert, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {formatDate(cert.date)}
                    </p>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Voir le certificat
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
