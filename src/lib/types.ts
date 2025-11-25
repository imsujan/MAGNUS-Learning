export type UserRole = 'learner' | 'instructor' | 'admin' | 'org_manager'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  organization?: string
  enrolledCourses: string[]
  completedCourses: string[]
  learningPaths: string[]
  skills: string[]
  createdAt: string
}

export interface Course {
  id: string
  title: string
  description: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  instructor: string
  instructorTitle: string
  tags: string[]
  skills: string[]
  thumbnail: string
  modules: Module[]
  enrollmentCount: number
  rating: number
  reviewCount: number
  createdAt: string
  createdBy?: string
}

export interface Module {
  id: string
  title: string
  duration: string
  videoUrl?: string
  videoDurationSeconds?: number // Duration of the video in seconds
  resources?: Resource[]
  completed?: boolean
}

export interface Resource {
  id: string
  title: string
  type: 'pdf' | 'link' | 'file'
  url: string
}

export interface VideoProgress {
  moduleId: string
  courseId: string
  userId: string
  watchedSeconds: number
  totalSeconds: number
  percentage: number
  lastWatchedAt: string
  completed: boolean
}

export interface LearningPath {
  id: string
  title: string
  description: string
  requiredCourses: string[]
  optionalCourses: string[]
  estimatedDuration: string
  skills: string[]
  level: string
  enrollmentCount: number
  createdAt: string
  courses?: Course[]
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  progress: number
  completedModules: string[]
  lastAccessedAt: string
  status: 'in_progress' | 'completed'
  completedAt?: string
  course?: Course
}

export interface Analytics {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  totalLearningPaths: number
  activeUsers: number
  completionRate: number
  averageProgress: number
  topCourses: Course[]
  recentEnrollments: Enrollment[]
}