import { useEffect, useState } from 'react'
import { ArrowRight, Clock, BookOpen, Award, CheckCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { fetchFromServer } from '../lib/supabase'
import type { LearningPath, User } from '../lib/types'

interface LearningPathsProps {
  user: User | null
  onNavigate: (page: string, params?: any) => void
}

export function LearningPaths({ user, onNavigate }: LearningPathsProps) {
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPaths()
  }, [])

  const loadPaths = async () => {
    try {
      const result = await fetchFromServer('/learning-paths')
      if (result.success) {
        setPaths(result.paths)
      }
    } catch (error) {
      console.error('Failed to load paths:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Learning Paths</h1>
          <p className="text-gray-600">
            Follow structured paths designed by experts to master specific skills
          </p>
        </div>

        {/* Paths Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : paths.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border">
            <Award className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl mb-2">No learning paths yet</h3>
            <p className="text-gray-600">Check back soon for curated learning paths</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {paths.map((path) => (
              <div
                key={path.id}
                className="bg-white rounded-lg border hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onNavigate('learning-path-detail', { id: path.id })}
              >
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-2 group-hover:text-blue-600 transition-colors">
                        {path.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {path.description}
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-blue-600 flex-shrink-0 ml-4" />
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {path.requiredCourses.length + (path.optionalCourses?.length || 0)} courses
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {path.estimatedDuration}
                    </div>
                    <Badge variant="outline">{path.level}</Badge>
                  </div>

                  {/* Skills */}
                  {path.skills && path.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {path.skills.slice(0, 4).map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {path.skills.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{path.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="pt-4 border-t flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {path.enrollmentCount} enrolled
                    </div>
                    <Button variant="ghost" size="sm" className="group-hover:text-blue-600">
                      View Path
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
