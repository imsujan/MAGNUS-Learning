import { useEffect, useState } from 'react'
import { ArrowRight, Play, TrendingUp, Award, Users, BookOpen } from 'lucide-react'
import { Button } from './ui/button'
import { CourseCard } from './CourseCard'
import { fetchFromServer } from '../lib/supabase'
import type { Course, User } from '../lib/types'

interface HomePageProps {
  user: User | null
  onNavigate: (page: string, params?: any) => void
}

export function HomePage({ user, onNavigate }: HomePageProps) {
  const [topCourses, setTopCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTopCourses()
  }, [])

  const loadTopCourses = async () => {
    try {
      const result = await fetchFromServer('/courses')
      if (result.success) {
        // Get top 6 courses by enrollment
        const sorted = result.courses
          .sort((a: Course, b: Course) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0))
          .slice(0, 6)
        setTopCourses(sorted)
      }
    } catch (error) {
      console.error('Failed to load courses:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="text-white" style={{ background: 'linear-gradient(to bottom, #4FC3F7, #0288D1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl">
                {user 
                  ? `Welcome back, ${user.name}!` 
                  : 'Unlock Your Potential'}
              </h1>
              <p className="text-xl text-white/90">
                {user
                  ? 'Continue your learning journey with our expert-led courses in BIM, MEPF, Architecture, and more.'
                  : 'Learn new skills, advance your career, and achieve your goals with expert-led courses.'}
              </p>
              <div className="flex gap-4">
                {user ? (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-white text-blue-600 hover:bg-white/90"
                      onClick={() => onNavigate('my-learning')}
                    >
                      Continue Learning
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-white text-white hover:bg-white/20"
                      onClick={() => onNavigate('catalog')}
                    >
                      Explore Courses
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-white text-blue-600 hover:bg-white/90"
                      onClick={() => onNavigate('signup')}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-white text-white hover:bg-white/20"
                      onClick={() => onNavigate('catalog')}
                    >
                      Browse Courses
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1762330910399-95caa55acf04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjMwOTUzMDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Learning"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <BookOpen className="h-10 w-10" style={{ color: '#03A9F4' }} />
              </div>
              <div className="text-3xl">500+</div>
              <div className="text-gray-600">Courses</div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <Users className="h-10 w-10" style={{ color: '#03A9F4' }} />
              </div>
              <div className="text-3xl">10,000+</div>
              <div className="text-gray-600">Learners</div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <Award className="h-10 w-10" style={{ color: '#03A9F4' }} />
              </div>
              <div className="text-3xl">50+</div>
              <div className="text-gray-600">Learning Paths</div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <TrendingUp className="h-10 w-10" style={{ color: '#03A9F4' }} />
              </div>
              <div className="text-3xl">95%</div>
              <div className="text-gray-600">Completion Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Courses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl">Popular Courses</h2>
            <p className="text-gray-600 mt-2">Start learning with our most popular courses</p>
          </div>
          <Button variant="outline" onClick={() => onNavigate('catalog')}>
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border p-4 animate-pulse">
                <div className="aspect-video bg-gray-200 rounded mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={(id) => onNavigate('course', { id })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'BIM', count: 45, color: 'bg-blue-500' },
              { name: 'MEPF', count: 32, color: 'bg-green-500' },
              { name: 'Architecture', count: 28, color: 'bg-purple-500' },
              { name: 'Software Development', count: 56, color: 'bg-orange-500' },
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => onNavigate('catalog', { category: category.name })}
                className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow text-left group"
              >
                <div className={`w-12 h-12 ${category.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`} />
                <h3 className="mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} courses</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Paths CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl mb-4">Ready to start a learning path?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Follow structured learning paths designed by experts to master specific skills and advance your career.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => onNavigate('learning-paths')}
          >
            Explore Learning Paths
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
