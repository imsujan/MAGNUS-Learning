import { useState, useEffect } from 'react'
import { GraduationCap, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { createClient } from '../lib/supabase'
import { fetchFromServer } from '../lib/supabase'
import { toast } from 'sonner@2.0.3'

interface AuthPageProps {
  mode: 'login' | 'signup'
  onSuccess: () => void
  onToggleMode: () => void
}

export function AuthPage({ mode, onSuccess, onToggleMode }: AuthPageProps) {
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: mode === 'login' ? 'demo@amd.com' : '',
    password: mode === 'login' ? 'password123' : '',
    name: '',
    role: 'learner' as 'learner' | 'instructor' | 'admin' | 'org_manager',
    organization: ''
  })

  // Update form when mode changes
  useEffect(() => {
    if (mode === 'login') {
      setFormData({
        email: 'demo@amd.com',
        password: 'password123',
        name: '',
        role: 'learner',
        organization: ''
      })
    } else {
      setFormData({
        email: '',
        password: '',
        name: '',
        role: 'learner',
        organization: ''
      })
    }
  }, [mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signup') {
        // Sign up via server
        const result = await fetchFromServer('/auth/signup', {
          method: 'POST',
          body: JSON.stringify(formData)
        })

        if (!result.success) {
          throw new Error(result.error || 'Signup failed')
        }

        // Then sign in
        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })

        if (error) throw error

        toast.success('Account created successfully!')
        onSuccess()
      } else {
        // Sign in
        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })

        if (error) throw error

        toast.success('Logged in successfully!')
        onSuccess()
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      if (mode === 'login') {
        toast.error('Invalid credentials. Try signing up first or use demo@amd.com / password123')
      } else {
        toast.error(error.message || 'Signup failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleMicrosoftSignIn = async () => {
    setOauthLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email profile openid',
          redirectTo: window.location.origin
        }
      })

      if (error) throw error

      // The user will be redirected to Microsoft login
      // After successful auth, they'll be redirected back to the app
    } catch (error: any) {
      console.error('Microsoft OAuth error:', error)
      toast.error('Microsoft sign-in failed. Please ensure OAuth is configured.')
      setOauthLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex flex-col items-center mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-12 w-12" style={{ color: '#03A9F4' }} />
                <span className="text-3xl" style={{ color: '#455A64' }}>AMD</span>
              </div>
              <span className="text-sm text-gray-500 mt-1">Aided Modelling with Design</span>
            </div>
            <h2 className="text-2xl">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-gray-600 mt-2">
              {mode === 'login' 
                ? 'Sign in to continue your learning journey' 
                : 'Start your learning journey today'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="learner">Learner</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                      <SelectItem value="org_manager">Organization Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization (Optional)</Label>
                  <Input
                    id="organization"
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Your company name"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                minLength={6}
              />
              {mode === 'signup' && (
                <p className="text-xs text-gray-500">At least 6 characters</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          {/* OR Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Microsoft OAuth Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleMicrosoftSignIn}
            disabled={oauthLoading}
          >
            {oauthLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <svg className="mr-2 h-5 w-5" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
              </svg>
            )}
            Sign in with Microsoft
          </Button>

          {/* Toggle Mode */}
          <div className="text-center text-sm">
            <span className="text-gray-600">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button 
              onClick={onToggleMode}
              className="hover:underline"
              style={{ color: '#03A9F4' }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          {/* Demo Info */}
          {mode === 'login' && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#E1F5FE' }}>
              <p className="text-sm">
                <strong>Quick Start:</strong><br />
                Email: demo@amd.com<br />
                Password: password123<br />
                <span className="text-xs text-gray-600 mt-1 block">
                  (Or create a new account to get started)
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12" style={{ background: 'linear-gradient(135deg, #4FC3F7, #0288D1)' }}>
        <div className="text-white space-y-6 max-w-lg">
          <h2 className="text-4xl">
            {mode === 'login' 
              ? 'Continue Learning & Growing' 
              : 'Transform Your Career'}
          </h2>
          <p className="text-xl text-white/90">
            Access thousands of courses in BIM, MEPF, Architecture, and Software Development. 
            Learn at your own pace with expert instructors.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="space-y-2">
              <div className="text-3xl">10,000+</div>
              <div className="text-white/90">Active Learners</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">500+</div>
              <div className="text-white/90">Courses</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">50+</div>
              <div className="text-white/90">Learning Paths</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">95%</div>
              <div className="text-white/90">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}