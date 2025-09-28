"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from './ui/skeleton'
import { toast } from 'sonner'
import { ProjectSummary } from '@/types'

const accessSchema = z.object({
  project_name: z.string().min(1, 'Project name is required'),
  password: z.string().min(1, 'Password is required'),
})

type AccessFormData = z.infer<typeof accessSchema>

interface ProjectAccessFormProps {
  projects: ProjectSummary[]
}

export function ProjectAccessForm({ projects }: ProjectAccessFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [projectInput, setProjectInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredProjects, setFilteredProjects] = useState<ProjectSummary[]>([])
  const router = useRouter()
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AccessFormData>({
    resolver: zodResolver(accessSchema),
  })

  const handleProjectInputChange = (value: string) => {
    setProjectInput(value)
    setValue('project_name', value)
    
    if (value.length > 0) {
      const filtered = projects.filter(project =>
        project.project_name.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredProjects(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
      setFilteredProjects([])
    }
  }

  const handleSuggestionClick = (projectName: string) => {
    setProjectInput(projectName)
    setValue('project_name', projectName)
    setShowSuggestions(false)
  }

  const onSubmit = async (data: AccessFormData) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/projects/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        // Store project session
        sessionStorage.setItem('project_auth', JSON.stringify({
          project_id: result.project.id,
          project_name: result.project.project_name,
          authenticated_at: Date.now()
        }))
        
        toast.success('Access granted! Redirecting to dashboard...')
        
        // Keep loading state active during navigation
        setTimeout(() => {
          router.push(`/project/${encodeURIComponent(data.project_name)}`)
        }, 1000)
      } else {
        toast.error(result.error || 'Authentication failed')
        setIsLoading(false)
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Access Project</CardTitle>
        <CardDescription className="text-center">
          Enter your project name and password to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2 relative">
            <Label htmlFor="project_name">Project Name</Label>
            <Input
              id="project_name"
              type="text"
              placeholder="Enter project name"
              value={projectInput}
              onChange={(e) => handleProjectInputChange(e.target.value)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onFocus={() => {
                if (projectInput.length > 0) setShowSuggestions(true)
              }}
            />
            {showSuggestions && filteredProjects.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleSuggestionClick(project.project_name)}
                  >
                    {project.project_name}
                  </div>
                ))}
              </div>
            )}
            {errors.project_name && (
              <p className="text-sm text-destructive">{errors.project_name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter project password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full bg-white text-black hover:text-white hover:bg-black" disabled={isLoading}>
            {isLoading ? (
              <>
                <Skeleton className="w-4 h-4 mr-2" />
                Authenticating...
              </>
            ) : (
              'Access Project'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}