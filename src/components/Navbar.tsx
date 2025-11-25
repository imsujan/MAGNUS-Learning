import { useState, useEffect } from 'react'
import { BookOpen, Search, Bell, User, LogOut, Settings, LayoutDashboard, GraduationCap, Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { createClient } from '../lib/supabase'
import type { User } from '../lib/types'

interface NavbarProps {
  user: User | null
  onLogout: () => void
  currentPage: string
  onNavigate: (page: string) => void
}

export function Navbar({ user, onLogout, currentPage, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onNavigate(`catalog?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
    <nav className="border-b sticky top-0 z-50" style={{ backgroundColor: '#455A64' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <GraduationCap className="h-8 w-8 text-white" />
              <span className="text-xl text-white">AMD</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => onNavigate('home')}
                className={`text-white hover:text-cyan-300 transition-colors ${currentPage === 'home' ? 'text-cyan-300' : ''}`}
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('catalog')}
                className={`text-white hover:text-cyan-300 transition-colors ${currentPage === 'catalog' ? 'text-cyan-300' : ''}`}
              >
                Courses
              </button>
              <button 
                onClick={() => onNavigate('learning-paths')}
                className={`text-white hover:text-cyan-300 transition-colors ${currentPage === 'learning-paths' ? 'text-cyan-300' : ''}`}
              >
                Learning Paths
              </button>
              {user && (
                <button 
                  onClick={() => onNavigate('my-learning')}
                  className={`text-white hover:text-cyan-300 transition-colors ${currentPage === 'my-learning' ? 'text-cyan-300' : ''}`}
                >
                  My Learning
                </button>
              )}
              {user && user.role === 'instructor' && (
                <button 
                  onClick={() => onNavigate('instructor')}
                  className={`text-white hover:text-cyan-300 transition-colors ${currentPage === 'instructor' ? 'text-cyan-300' : ''}`}
                >
                  Instructor
                </button>
              )}
              {user && (user.role === 'admin' || user.role === 'org_manager') && (
                <button 
                  onClick={() => onNavigate('admin')}
                  className={`text-white hover:text-cyan-300 transition-colors ${currentPage === 'admin' ? 'text-cyan-300' : ''}`}
                >
                  Admin
                </button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search courses, skills, topics..."
                  className="pl-10 bg-white/90 border-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-white/10">
                  <Bell className="h-5 w-5 text-white" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-white/10">
                      <div className="h-8 w-8 rounded-full text-white flex items-center justify-center" style={{ backgroundColor: '#03A9F4' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div>
                        <div>{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                        <div className="text-xs mt-1 capitalize" style={{ color: '#03A9F4' }}>{user.role}</div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate('my-learning')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" onClick={() => onNavigate('login')} className="text-white hover:bg-white/10">
                  Log in
                </Button>
                <Button onClick={() => onNavigate('signup')} style={{ backgroundColor: '#03A9F4' }} className="hover:opacity-90">
                  Sign up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t mt-2 pt-4">
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search courses..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>

              <button 
                onClick={() => { onNavigate('home'); setMobileMenuOpen(false) }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
              >
                Home
              </button>
              <button 
                onClick={() => { onNavigate('catalog'); setMobileMenuOpen(false) }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
              >
                Courses
              </button>
              <button 
                onClick={() => { onNavigate('learning-paths'); setMobileMenuOpen(false) }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
              >
                Learning Paths
              </button>
              {user && (
                <>
                  <button 
                    onClick={() => { onNavigate('my-learning'); setMobileMenuOpen(false) }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                  >
                    My Learning
                  </button>
                  {user.role === 'instructor' && (
                    <button 
                      onClick={() => { onNavigate('instructor'); setMobileMenuOpen(false) }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      Instructor
                    </button>
                  )}
                  {(user.role === 'admin' || user.role === 'org_manager') && (
                    <button 
                      onClick={() => { onNavigate('admin'); setMobileMenuOpen(false) }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      Admin
                    </button>
                  )}
                </>
              )}

              {!user && (
                <div className="flex flex-col gap-2 pt-4">
                  <Button variant="outline" onClick={() => { onNavigate('login'); setMobileMenuOpen(false) }}>
                    Log in
                  </Button>
                  <Button onClick={() => { onNavigate('signup'); setMobileMenuOpen(false) }}>
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
