import { useEffect, useState } from 'react'
import { Toaster } from './components/ui/sonner'
import { Navbar } from './components/Navbar'
import { AuthPage } from './components/AuthPage'
import { HomePage } from './components/HomePage'
import { CourseCatalog } from './components/CourseCatalog'
import { CourseDetail } from './components/CourseDetail'
import { LearningPaths } from './components/LearningPaths'
import { MyLearning } from './components/MyLearning'
import { AdminConsole } from './components/AdminConsole'
import { InstructorDashboard } from './components/InstructorDashboard'
import { createClient, fetchFromServer } from './lib/supabase'
import type { User } from './lib/types'

type Page = 
  | 'home' 
  | 'login' 
  | 'signup' 
  | 'catalog' 
  | 'course' 
  | 'learning-paths' 
  | 'learning-path-detail'
  | 'my-learning' 
  | 'admin'
  | 'instructor'
  | 'profile'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [pageParams, setPageParams] = useState<any>({})
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const result = await fetchFromServer('/users/me')
        if (result.success) {
          setUser(result.user)
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page as Page)
    setPageParams(params || {})
    window.scrollTo(0, 0)
    
    // Update URL with search params if catalog page
    if (page === 'catalog' && params?.search) {
      // This is just for visual feedback, not actual routing
      console.log('Navigating to catalog with search:', params.search)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setCurrentPage('home')
  }

  const handleAuthSuccess = () => {
    checkUser()
    setCurrentPage('home')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  // Auth pages (no navbar)
  if (currentPage === 'login' || currentPage === 'signup') {
    return (
      <>
        <AuthPage
          mode={currentPage}
          onSuccess={handleAuthSuccess}
          onToggleMode={() => setCurrentPage(currentPage === 'login' ? 'signup' : 'login')}
        />
        <Toaster />
      </>
    )
  }

  // Main app with navbar
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <Navbar
        user={user}
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Page Content */}
      {currentPage === 'home' && (
        <HomePage user={user} onNavigate={handleNavigate} />
      )}

      {currentPage === 'catalog' && (
        <CourseCatalog
          onSelectCourse={(id) => handleNavigate('course', { id })}
          initialFilters={pageParams}
        />
      )}

      {currentPage === 'course' && pageParams.id && (
        <CourseDetail
          courseId={pageParams.id}
          user={user}
          onBack={() => handleNavigate('catalog')}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === 'learning-paths' && (
        <LearningPaths user={user} onNavigate={handleNavigate} />
      )}

      {currentPage === 'my-learning' && user && (
        <MyLearning user={user} onNavigate={handleNavigate} />
      )}

      {currentPage === 'admin' && user && (user.role === 'admin' || user.role === 'org_manager') && (
        <AdminConsole user={user} />
      )}

      {currentPage === 'instructor' && user && user.role === 'instructor' && (
        <InstructorDashboard user={user} onNavigate={handleNavigate} />
      )}

      {currentPage === 'profile' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border p-6">
            <h1 className="text-2xl mb-4">Profile Settings</h1>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <div>{user?.name}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <div>{user?.email}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Role</label>
                <div className="capitalize">{user?.role}</div>
              </div>
              {user?.organization && (
                <div>
                  <label className="text-sm text-gray-600">Organization</label>
                  <div>{user.organization}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  )
}
