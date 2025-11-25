import { useEffect, useState } from 'react'
import { TrendingUp, Award, Clock, BookOpen, Target } from 'lucide-react'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { CourseCard } from './CourseCard'
import { fetchFromServer } from '../lib/supabase'
import type { User, Enrollment } from '../lib/types'

interface MyLearningProps {
  user: User
  onNavigate: (page: string, params?: any) => void
}

export function MyLearning({ user, onNavigate }: MyLearningProps) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    inProgress: 0,
    completed: 0,
    averageProgress: 0
  })

  useEffect(() => {
    loadEnrollments()
  }, [])

  const loadEnrollments = async () => {
    try {
      const result = await fetchFromServer('/enrollments/my-courses')
      if (result.success) {
        setEnrollments(result.enrollments)
        calculateStats(result.enrollments)
      }
    } catch (error) {
      console.error('Failed to load enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (enrollments: Enrollment[]) => {
    const total = enrollments.length
    const inProgress = enrollments.filter(e => e.status === 'in_progress').length
    const completed = enrollments.filter(e => e.status === 'completed').length
    const avgProgress = total > 0
      ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / total
      : 0

    setStats({
      totalEnrolled: total,
      inProgress,
      completed,
      averageProgress: avgProgress
    })
  }

  const inProgressCourses = enrollments.filter(e => e.status === 'in_progress')
  const completedCourses = enrollments.filter(e => e.status === 'completed')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">My Learning</h1>
          <p className="text-gray-600">Track your progress and continue learning</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Enrolled</span>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl">{stats.totalEnrolled}</div>
            <div className="text-sm text-gray-500 mt-1">Total courses</div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">In Progress</span>
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-3xl">{stats.inProgress}</div>
            <div className="text-sm text-gray-500 mt-1">Active learning</div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Completed</span>
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl">{stats.completed}</div>
            <div className="text-sm text-gray-500 mt-1">Certificates earned</div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Avg Progress</span>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl">{Math.round(stats.averageProgress)}%</div>
            <div className="text-sm text-gray-500 mt-1">Overall completion</div>
          </div>
        </div>

        {/* Course Lists */}
        {enrollments.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <Target className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl mb-2">Start Your Learning Journey</h3>
            <p className="text-gray-600 mb-6">
              You haven't enrolled in any courses yet. Explore our catalog to get started!
            </p>
            <Button onClick={() => onNavigate('catalog')}>
              Browse Courses
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="in-progress" className="space-y-6">
            <TabsList>
              <TabsTrigger value="in-progress">
                In Progress ({inProgressCourses.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedCourses.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All Courses ({enrollments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="in-progress" className="space-y-6">
              {inProgressCourses.length === 0 ? (
                <div className="bg-white rounded-lg border p-12 text-center">
                  <p className="text-gray-600">No courses in progress</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgressCourses.map((enrollment) => (
                    enrollment.course && (
                      <CourseCard
                        key={enrollment.id}
                        course={enrollment.course}
                        onSelect={(id) => onNavigate('course', { id })}
                        enrolled={true}
                        progress={enrollment.progress}
                      />
                    )
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              {completedCourses.length === 0 ? (
                <div className="bg-white rounded-lg border p-12 text-center">
                  <p className="text-gray-600">No completed courses yet</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedCourses.map((enrollment) => (
                    enrollment.course && (
                      <CourseCard
                        key={enrollment.id}
                        course={enrollment.course}
                        onSelect={(id) => onNavigate('course', { id })}
                        enrolled={true}
                        progress={100}
                      />
                    )
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment) => (
                  enrollment.course && (
                    <CourseCard
                      key={enrollment.id}
                      course={enrollment.course}
                      onSelect={(id) => onNavigate('course', { id })}
                      enrolled={true}
                      progress={enrollment.progress}
                    />
                  )
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Recommendations */}
        {enrollments.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl">Recommended for You</h2>
                <p className="text-gray-600 mt-1">Based on your learning history</p>
              </div>
              <Button variant="outline" onClick={() => onNavigate('catalog')}>
                Browse All
              </Button>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-white text-center">
              <h3 className="text-2xl mb-2">Continue Your Learning Journey</h3>
              <p className="text-blue-100 mb-6">
                Explore more courses to expand your skills
              </p>
              <Button variant="secondary" onClick={() => onNavigate('catalog')}>
                Explore Courses
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
