import { useEffect, useState } from 'react'
import { ArrowLeft, Clock, Users, Star, PlayCircle, CheckCircle, Lock, Download, BookOpen } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { VideoPlayer } from './VideoPlayer'
import { fetchFromServer } from '../lib/supabase'
import { toast } from 'sonner@2.0.3'
import type { Course, User, Module, Enrollment, VideoProgress } from '../lib/types'

interface CourseDetailProps {
  courseId: string
  user: User | null
  onBack: () => void
  onNavigate: (page: string) => void
}

export function CourseDetail({ courseId, user, onBack, onNavigate }: CourseDetailProps) {
  const [course, setCourse] = useState<Course | null>(null)
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [currentModule, setCurrentModule] = useState<Module | null>(null)
  const [playingVideo, setPlayingVideo] = useState(false)
  const [videoProgress, setVideoProgress] = useState<Record<string, VideoProgress>>({})

  useEffect(() => {
    loadCourse()
    if (user) {
      loadEnrollment()
      loadVideoProgress()
    }
  }, [courseId, user])

  const loadCourse = async () => {
    try {
      const result = await fetchFromServer(`/courses/${courseId}`)
      console.log('Load course result:', result, 'for courseId:', courseId)
      if (result.success) {
        setCourse(result.course)
        if (result.course.modules && result.course.modules.length > 0) {
          setCurrentModule(result.course.modules[0])
        }
      } else {
        console.error('Course not found - result:', result)
        toast.error(result.error || 'Course not found')
      }
    } catch (error) {
      console.error('Failed to load course:', error)
      toast.error('Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const loadEnrollment = async () => {
    try {
      const result = await fetchFromServer('/enrollments/my-courses')
      if (result.success) {
        const courseEnrollment = result.enrollments.find(
          (e: Enrollment) => e.courseId === courseId
        )
        setEnrollment(courseEnrollment || null)
      }
    } catch (error) {
      console.error('Failed to load enrollment:', error)
    }
  }

  const loadVideoProgress = async () => {
    try {
      const result = await fetchFromServer(`/video-progress/${courseId}`)
      if (result.success && result.videoProgress) {
        // Convert array to keyed object by moduleId
        const progressMap: Record<string, VideoProgress> = {}
        result.videoProgress.forEach((vp: VideoProgress) => {
          progressMap[vp.moduleId] = vp
        })
        setVideoProgress(progressMap)
      }
    } catch (error) {
      console.error('Failed to load video progress:', error)
    }
  }

  const handleVideoProgressUpdate = async (progress: {
    watchedSeconds: number
    totalSeconds: number
    percentage: number
  }) => {
    if (!currentModule || !user) return

    try {
      const result = await fetchFromServer('/video-progress', {
        method: 'POST',
        body: JSON.stringify({
          courseId,
          moduleId: currentModule.id,
          ...progress
        })
      })

      if (result.success) {
        // Update local state
        setVideoProgress(prev => ({
          ...prev,
          [currentModule.id]: result.videoProgress
        }))

        // Reload enrollment to get updated completion status
        if (result.videoProgress.completed) {
          loadEnrollment()
          toast.success('Module completed!')
        }
      }
    } catch (error) {
      console.error('Failed to save video progress:', error)
    }
  }

  const handleEnroll = async () => {
    if (!user) {
      onNavigate('login')
      return
    }

    setEnrolling(true)
    try {
      const result = await fetchFromServer('/enrollments', {
        method: 'POST',
        body: JSON.stringify({ courseId })
      })

      if (result.success) {
        toast.success('Successfully enrolled in course!')
        loadEnrollment()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      console.error('Enrollment error:', error)
      toast.error(error.message || 'Failed to enroll')
    } finally {
      setEnrolling(false)
    }
  }

  const handleModuleComplete = async (moduleId: string) => {
    if (!enrollment) return

    try {
      const completedModules = [...enrollment.completedModules, moduleId]
      const progress = (completedModules.length / (course?.modules.length || 1)) * 100

      const result = await fetchFromServer(`/enrollments/${courseId}/progress`, {
        method: 'PUT',
        body: JSON.stringify({
          moduleId,
          progress,
          completed: progress >= 100
        })
      })

      if (result.success) {
        setEnrollment(result.enrollment)
        toast.success('Module marked as complete!')
      }
    } catch (error) {
      console.error('Failed to update progress:', error)
      toast.error('Failed to update progress')
    }
  }

  const isModuleCompleted = (moduleId: string) => {
    return enrollment?.completedModules.includes(moduleId)
  }

  // Helper to convert duration string to seconds
  const parseDurationToSeconds = (duration: string): number => {
    // Handle formats like "45 min", "1h 30m", "90m", "1.5h"
    let totalSeconds = 0
    
    // Hours
    const hoursMatch = duration.match(/(\d+(?:\.\d+)?)\s*h/)
    if (hoursMatch) {
      totalSeconds += parseFloat(hoursMatch[1]) * 3600
    }
    
    // Minutes  
    const minsMatch = duration.match(/(\d+(?:\.\d+)?)\s*m(?:in)?/)
    if (minsMatch) {
      totalSeconds += parseFloat(minsMatch[1]) * 60
    }
    
    // If just a number, assume minutes
    if (!hoursMatch && !minsMatch) {
      const numMatch = duration.match(/(\d+(?:\.\d+)?)/)
      if (numMatch) {
        totalSeconds = parseFloat(numMatch[1]) * 60
      }
    }
    
    return totalSeconds || 600 // Default to 10 minutes if parsing fails
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Course not found</h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Video Player / Header */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto">
          {playingVideo && currentModule ? (
            currentModule.videoUrl ? (
              <VideoPlayer
                videoUrl={currentModule.videoUrl}
                moduleId={currentModule.id}
                moduleTitle={currentModule.title}
                videoDuration={parseDurationToSeconds(currentModule.duration)}
                lastWatchedPosition={videoProgress[currentModule.id]?.watchedSeconds || 0}
                onProgressUpdate={handleVideoProgressUpdate}
                onClose={() => setPlayingVideo(false)}
                autoResume={true}
              />
            ) : (
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <div className="text-white text-center">
                  <PlayCircle className="h-20 w-20 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No video available for this module</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Please contact the instructor to add video content
                  </p>
                  <Button
                    className="mt-4"
                    variant="secondary"
                    onClick={() => setPlayingVideo(false)}
                  >
                    Close Player
                  </Button>
                </div>
              </div>
            )
          ) : (
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full aspect-video object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {enrollment ? (
                  <Button
                    size="lg"
                    onClick={() => setPlayingVideo(true)}
                    className="bg-white text-black hover:bg-gray-100"
                  >
                    <PlayCircle className="mr-2 h-6 w-6" />
                    Continue Learning
                  </Button>
                ) : (
                  <div className="text-center text-white">
                    <PlayCircle className="h-20 w-20 mx-auto mb-4 opacity-80" />
                    <p className="text-xl">Preview this course</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Info */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="secondary" className="mb-2">{course.category}</Badge>
                  <h1 className="text-3xl mb-2">{course.title}</h1>
                  <p className="text-gray-600">{course.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.enrollmentCount} enrolled
                </div>
                {course.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {course.rating.toFixed(1)} ({course.reviewCount} reviews)
                  </div>
                )}
                <div>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-1">Instructor</p>
                <div>
                  <span>{course.instructor}</span>
                  {course.instructorTitle && (
                    <span className="text-gray-500"> • {course.instructorTitle}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="curriculum" className="bg-white rounded-lg border">
              <TabsList className="w-full justify-start rounded-none border-b">
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum" className="p-6">
                <h3 className="mb-4">Course Curriculum</h3>
                <div className="space-y-2">
                  {course.modules.map((module, index) => {
                    const completed = isModuleCompleted(module.id)
                    const locked = !enrollment && index > 0
                    const moduleProgress = videoProgress[module.id]

                    return (
                      <div
                        key={module.id}
                        className={`border rounded-lg ${
                          completed ? 'bg-green-50 border-green-200' : ''
                        } ${locked ? 'opacity-50' : 'hover:bg-gray-50 cursor-pointer'}`}
                      >
                        <div
                          className="p-4 flex items-center justify-between"
                          onClick={() => {
                            if (!locked) {
                              setCurrentModule(module)
                              setPlayingVideo(true)
                            }
                          }}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center justify-center w-8">
                              {completed ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : locked ? (
                                <Lock className="h-5 w-5 text-gray-400" />
                              ) : (
                                <PlayCircle className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span>{module.title}</span>
                                {moduleProgress && !completed && (
                                  <span className="text-xs text-cyan-600 ml-2">
                                    {Math.round(moduleProgress.percentage)}% watched
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{module.duration}</div>
                            </div>
                          </div>
                          {enrollment && !completed && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleModuleComplete(module.id)
                              }}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                        {/* Video Progress Bar */}
                        {moduleProgress && !completed && (
                          <div className="px-4 pb-3">
                            <Progress 
                              value={moduleProgress.percentage} 
                              className="h-1.5"
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="overview" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3">What you'll learn</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {course.skills.map((skill, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="instructor" className="p-6">
                <div>
                  <h3 className="mb-2">{course.instructor}</h3>
                  <p className="text-gray-600 mb-4">{course.instructorTitle}</p>
                  <p className="text-sm text-gray-600">
                    Expert instructor with years of experience in {course.category}. 
                    Dedicated to helping students achieve their learning goals through 
                    practical, hands-on instruction.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              {enrollment ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Your Progress</span>
                      <span className="text-sm">{Math.round(enrollment.progress)}%</span>
                    </div>
                    <Progress value={enrollment.progress} />
                  </div>

                  <div className="text-sm text-gray-600">
                    {enrollment.completedModules.length} of {course.modules.length} modules completed
                  </div>

                  <Button className="w-full" onClick={() => setPlayingVideo(true)}>
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Continue Learning
                  </Button>

                  {enrollment.status === 'completed' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm">Course Completed!</p>
                      <Button variant="outline" className="mt-2 w-full" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Certificate
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">Free</div>
                    <p className="text-sm text-gray-600">Get full access to this course</p>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </Button>

                  <div className="text-xs text-gray-500 text-center">
                    Free access • No credit card required
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                  <span>{course.modules.length} modules</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span>{course.duration} total length</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span>{course.enrollmentCount} students enrolled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}