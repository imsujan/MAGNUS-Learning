import { useEffect, useState } from 'react'
import { BarChart3, Users, BookOpen, TrendingUp, Plus, Upload, FileText } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { fetchFromServer } from '../lib/supabase'
import { toast } from 'sonner@2.0.3'
import type { User, Analytics, Course } from '../lib/types'

interface AdminConsoleProps {
  user: User
}

export function AdminConsole({ user }: AdminConsoleProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [createCourseOpen, setCreateCourseOpen] = useState(false)
  const [seedingData, setSeedingData] = useState(false)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const result = await fetchFromServer('/analytics/overview')
      if (result.success) {
        setAnalytics(result.analytics)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSeedData = async () => {
    setSeedingData(true)
    try {
      const result = await fetchFromServer('/seed-data', { method: 'POST' })
      if (result.success) {
        toast.success('Sample data created successfully!')
        loadAnalytics()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      console.error('Seed data error:', error)
      toast.error(error.message || 'Failed to seed data')
    } finally {
      setSeedingData(false)
    }
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    const courseData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      level: formData.get('level'),
      duration: formData.get('duration'),
      instructor: formData.get('instructor'),
      instructorTitle: formData.get('instructorTitle'),
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()),
      skills: (formData.get('skills') as string).split(',').map(s => s.trim()),
      thumbnail: formData.get('thumbnail') || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
      modules: []
    }

    try {
      const result = await fetchFromServer('/courses', {
        method: 'POST',
        body: JSON.stringify(courseData)
      })

      if (result.success) {
        toast.success('Course created successfully!')
        setCreateCourseOpen(false)
        loadAnalytics()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      console.error('Create course error:', error)
      toast.error(error.message || 'Failed to create course')
    }
  }

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Admin Console</h1>
            <p className="text-gray-600">Manage your learning platform</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSeedData} disabled={seedingData} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              {seedingData ? 'Creating...' : 'Seed Sample Data'}
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        {analytics && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Total Users</span>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-3xl">{analytics.totalUsers}</div>
              <div className="text-sm text-gray-500 mt-1">
                {analytics.activeUsers} active
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Total Courses</span>
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-3xl">{analytics.totalCourses}</div>
              <div className="text-sm text-gray-500 mt-1">
                {analytics.totalLearningPaths} learning paths
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Enrollments</span>
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-3xl">{analytics.totalEnrollments}</div>
              <div className="text-sm text-gray-500 mt-1">
                {Math.round(analytics.completionRate)}% completion
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Avg Progress</span>
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-3xl">{Math.round(analytics.averageProgress)}%</div>
              <div className="text-sm text-gray-500 mt-1">Overall platform</div>
            </div>
          </div>
        )}

        {/* Admin Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl">Course Management</h2>
                <Dialog open={createCourseOpen} onOpenChange={setCreateCourseOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Course
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Course</DialogTitle>
                      <DialogDescription>
                        Add a new course to your platform
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateCourse} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Course Title</Label>
                        <Input id="title" name="title" required placeholder="Introduction to BIM" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          name="description" 
                          required 
                          placeholder="Course description..."
                          rows={3}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select name="category" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BIM">BIM</SelectItem>
                              <SelectItem value="MEPF">MEPF</SelectItem>
                              <SelectItem value="Architecture">Architecture</SelectItem>
                              <SelectItem value="Software Development">Software Development</SelectItem>
                              <SelectItem value="Project Management">Project Management</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="level">Level</Label>
                          <Select name="level" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input id="duration" name="duration" required placeholder="e.g., 8 hours" />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="instructor">Instructor Name</Label>
                          <Input id="instructor" name="instructor" required placeholder="John Doe" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="instructorTitle">Instructor Title</Label>
                          <Input id="instructorTitle" name="instructorTitle" placeholder="Senior Architect" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input id="tags" name="tags" placeholder="Revit, BIM, 3D Modeling" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="skills">Skills (comma-separated)</Label>
                        <Input id="skills" name="skills" placeholder="3D Modeling, BIM Coordination" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
                        <Input id="thumbnail" name="thumbnail" type="url" placeholder="https://..." />
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setCreateCourseOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Create Course</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="p-6">
                {analytics && analytics.topCourses && analytics.topCourses.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topCourses.slice(0, 10).map((course: Course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div>{course.title}</div>
                          <div className="text-sm text-gray-500">
                            {course.category} • {course.level}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {course.enrollmentCount} enrolled
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No courses yet. Create your first course or seed sample data.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl mb-4">User Management</h2>
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>User management interface - coming soon</p>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl mb-6">Platform Analytics</h2>
              
              {analytics && analytics.recentEnrollments && analytics.recentEnrollments.length > 0 ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3">Recent Enrollments</h3>
                    <div className="space-y-2">
                      {analytics.recentEnrollments.slice(0, 10).map((enrollment: any) => (
                        <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="text-sm">
                            <div className="font-medium">User: {enrollment.userId.slice(0, 8)}...</div>
                            <div className="text-gray-500">Course: {enrollment.courseId}</div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No analytics data yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Learning Paths Tab */}
          <TabsContent value="paths">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">Learning Paths</h2>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Path
                </Button>
              </div>
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Learning path management - coming soon</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
