import { useState, useEffect } from 'react'
import { Upload, Plus, Trash2, Video, Save, X, FolderOpen, Route, Edit, MoreVertical } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Checkbox } from './ui/checkbox'
import { toast } from 'sonner@2.0.3'
import { fetchFromServer } from '../lib/supabase'
import type { User, Course, LearningPath } from '../lib/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface InstructorDashboardProps {
  user: User
  onNavigate: (page: string, params?: any) => void
}

interface ChapterInput {
  id: string
  title: string
  duration: string
  videoFile: File | null
  videoUrl?: string
}

interface FolderChapter {
  name: string
  videos: File[]
}

export function InstructorDashboard({ user, onNavigate }: InstructorDashboardProps) {
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'create-path'>('list')
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [myCourses, setMyCourses] = useState<Course[]>([])
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [myPaths, setMyPaths] = useState<LearningPath[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<'manual' | 'folder'>('manual')

  // Course form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')
  const [tags, setTags] = useState('')
  const [skills, setSkills] = useState('')
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [chapters, setChapters] = useState<ChapterInput[]>([
    { id: '1', title: '', duration: '', videoFile: null }
  ])
  const [folderChapters, setFolderChapters] = useState<FolderChapter[]>([])

  // Learning Path form state
  const [pathTitle, setPathTitle] = useState('')
  const [pathDescription, setPathDescription] = useState('')
  const [pathSkills, setPathSkills] = useState('')
  const [pathLevel, setPathLevel] = useState('Beginner')
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [optionalCourses, setOptionalCourses] = useState<string[]>([])

  useEffect(() => {
    loadMyCourses()
    loadAllCourses()
    loadMyPaths()
  }, [])

  const loadMyCourses = async () => {
    try {
      setLoading(true)
      const result = await fetchFromServer('/courses')
      if (result.success) {
        // Filter courses created by this instructor
        const instructorCourses = result.courses.filter(
          (course: Course) => course.createdBy === user.id
        )
        setMyCourses(instructorCourses)
      }
    } catch (error) {
      console.error('Failed to load courses:', error)
      toast.error('Failed to load your courses')
    } finally {
      setLoading(false)
    }
  }

  const loadAllCourses = async () => {
    try {
      const result = await fetchFromServer('/courses')
      if (result.success) {
        setAllCourses(result.courses)
      }
    } catch (error) {
      console.error('Failed to load all courses:', error)
    }
  }

  const loadMyPaths = async () => {
    try {
      const result = await fetchFromServer('/learning-paths')
      if (result.success) {
        setMyPaths(result.paths || [])
      }
    } catch (error) {
      console.error('Failed to load learning paths:', error)
    }
  }

  const addChapter = () => {
    setChapters([
      ...chapters,
      { id: String(chapters.length + 1), title: '', duration: '', videoFile: null }
    ])
  }

  const removeChapter = (id: string) => {
    if (chapters.length > 1) {
      setChapters(chapters.filter(ch => ch.id !== id))
    }
  }

  const updateChapter = (id: string, field: string, value: any) => {
    setChapters(chapters.map(ch => 
      ch.id === id ? { ...ch, [field]: value } : ch
    ))
  }

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Group files by their parent folder
    const folderMap = new Map<string, File[]>()
    
    files.forEach(file => {
      const pathParts = file.webkitRelativePath.split('/')
      // First part is the root folder, second part is the chapter folder
      if (pathParts.length >= 3) {
        const chapterName = pathParts[1]
        const videoFiles = folderMap.get(chapterName) || []
        videoFiles.push(file)
        folderMap.set(chapterName, videoFiles)
      }
    })

    // Convert to FolderChapter array
    const chapters: FolderChapter[] = []
    folderMap.forEach((videos, name) => {
      chapters.push({ name, videos })
    })

    setFolderChapters(chapters)
    toast.success(`Found ${chapters.length} chapters with ${files.length} videos`)
  }

  const uploadVideoToStorage = async (file: File, chapterId: string): Promise<string> => {
    const formData = new FormData()
    formData.append('video', file)
    formData.append('chapterId', chapterId)
    
    try {
      const response = await fetch(
        await (await import('../lib/supabase')).getServerUrl('/upload/video'),
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${(await import('../utils/supabase/info')).publicAnonKey}`
          },
          body: formData
        }
      )
      
      const result = await response.json()
      if (result.success) {
        return result.videoUrl
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Video upload error:', error)
      throw error
    }
  }

  const uploadThumbnail = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('thumbnail', file)
    
    try {
      const response = await fetch(
        await (await import('../lib/supabase')).getServerUrl('/upload/thumbnail'),
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${(await import('../utils/supabase/info')).publicAnonKey}`
          },
          body: formData
        }
      )
      
      const result = await response.json()
      if (result.success) {
        return result.thumbnailUrl
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Thumbnail upload error:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !description || !category) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setUploading(true)
      toast.info('Uploading course content...')

      let modulesWithVideos

      if (uploadMethod === 'folder' && folderChapters.length > 0) {
        // Process folder upload
        modulesWithVideos = await Promise.all(
          folderChapters.map(async (chapter, index) => {
            const videoUrls: string[] = []
            
            for (const videoFile of chapter.videos) {
              try {
                const url = await uploadVideoToStorage(videoFile, `${index + 1}`)
                videoUrls.push(url)
                toast.success(`Uploaded ${videoFile.name}`)
              } catch (error) {
                console.error(`Failed to upload ${videoFile.name}:`, error)
                toast.error(`Failed to upload ${videoFile.name}`)
              }
            }

            // Estimate duration based on number of videos (10 mins per video average)
            const estimatedDuration = `${chapter.videos.length * 10}`

            return {
              id: String(index + 1),
              title: chapter.name,
              duration: estimatedDuration,
              videoUrl: videoUrls[0] || undefined, // Use first video as main
              completed: false
            }
          })
        )
      } else {
        // Process manual chapter upload
        if (chapters.some(ch => !ch.title || !ch.duration)) {
          toast.error('Please complete all chapter information')
          setUploading(false)
          return
        }

        modulesWithVideos = await Promise.all(
          chapters.map(async (chapter) => {
            let videoUrl = chapter.videoUrl || ''
            
            if (chapter.videoFile) {
              try {
                videoUrl = await uploadVideoToStorage(chapter.videoFile, chapter.id)
                toast.success(`Uploaded video for ${chapter.title}`)
              } catch (error) {
                console.error(`Failed to upload video for chapter ${chapter.id}:`, error)
                toast.error(`Failed to upload video for ${chapter.title}`)
              }
            }

            return {
              id: chapter.id,
              title: chapter.title,
              duration: chapter.duration,
              videoUrl: videoUrl || undefined,
              completed: false
            }
          })
        )
      }

      // Calculate total duration
      const totalMinutes = modulesWithVideos.reduce((sum, mod) => {
        const mins = parseInt(mod.duration) || 0
        return sum + mins
      }, 0)
      const hours = Math.floor(totalMinutes / 60)
      const mins = totalMinutes % 60
      const duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

      // Upload thumbnail
      let thumbnailUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop'
      if (thumbnailFile) {
        try {
          thumbnailUrl = await uploadThumbnail(thumbnailFile)
          toast.success('Thumbnail uploaded successfully')
        } catch (error) {
          console.error('Failed to upload thumbnail:', error)
          toast.error('Failed to upload thumbnail, using default')
        }
      }

      const courseData = {
        title,
        description,
        category,
        level,
        duration,
        instructor: user.name,
        instructorTitle: user.role === 'instructor' ? 'Instructor' : 'Administrator',
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        thumbnail: thumbnailUrl,
        modules: modulesWithVideos
      }

      const result = await fetchFromServer('/courses', {
        method: 'POST',
        body: JSON.stringify(courseData)
      })

      console.log('Course creation result:', result)

      if (result.success) {
        toast.success('Course created successfully!')
        console.log('Created course:', result.course)
        resetForm()
        setView('list')
        loadMyCourses()
      } else {
        toast.error(result.error || 'Failed to create course')
      }
    } catch (error) {
      console.error('Course creation error:', error)
      toast.error('Failed to create course')
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setCategory('')
    setLevel('Beginner')
    setTags('')
    setSkills('')
    setThumbnailFile(null)
    setChapters([{ id: '1', title: '', duration: '', videoFile: null }])
    setFolderChapters([])
    setUploadMethod('manual')
  }

  const handleCreateLearningPath = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!pathTitle || !pathDescription || selectedCourses.length === 0) {
      toast.error('Please fill in all required fields and select at least one course')
      return
    }

    try {
      setUploading(true)

      // Calculate estimated duration
      const pathCourses = allCourses.filter(c => selectedCourses.includes(c.id))
      const totalMinutes = pathCourses.reduce((sum, course) => {
        const duration = course.duration
        const hours = parseInt(duration.match(/(\d+)h/)?.[1] || '0')
        const mins = parseInt(duration.match(/(\d+)m/)?.[1] || '0')
        return sum + (hours * 60) + mins
      }, 0)
      const hours = Math.floor(totalMinutes / 60)
      const estimatedDuration = `${hours} hours`

      const pathData = {
        title: pathTitle,
        description: pathDescription,
        requiredCourses: selectedCourses,
        optionalCourses: optionalCourses,
        estimatedDuration,
        skills: pathSkills.split(',').map(s => s.trim()).filter(Boolean),
        level: pathLevel
      }

      const result = await fetchFromServer('/learning-paths', {
        method: 'POST',
        body: JSON.stringify(pathData)
      })

      if (result.success) {
        toast.success('Learning path created successfully!')
        resetPathForm()
        setView('list')
        loadMyPaths()
      } else {
        toast.error(result.error || 'Failed to create learning path')
      }
    } catch (error) {
      console.error('Learning path creation error:', error)
      toast.error('Failed to create learning path')
    } finally {
      setUploading(false)
    }
  }

  const resetPathForm = () => {
    setPathTitle('')
    setPathDescription('')
    setPathSkills('')
    setPathLevel('Beginner')
    setSelectedCourses([])
    setOptionalCourses([])
  }

  const toggleCourseSelection = (courseId: string, isRequired: boolean) => {
    if (isRequired) {
      if (selectedCourses.includes(courseId)) {
        setSelectedCourses(selectedCourses.filter(id => id !== courseId))
      } else {
        setSelectedCourses([...selectedCourses, courseId])
      }
    } else {
      if (optionalCourses.includes(courseId)) {
        setOptionalCourses(optionalCourses.filter(id => id !== courseId))
      } else {
        setOptionalCourses([...optionalCourses, courseId])
      }
    }
  }

  // Handle edit course
  const handleEditCourse = (course: Course, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigation to course detail
    
    // Load course data into form
    setTitle(course.title)
    setDescription(course.description)
    setCategory(course.category)
    setLevel(course.level)
    setTags(course.tags.join(', '))
    setSkills(course.skills.join(', '))
    setEditingCourse(course)
    
    // Convert modules to chapters
    const loadedChapters: ChapterInput[] = course.modules.map((mod, index) => ({
      id: mod.id || String(index + 1),
      title: mod.title,
      duration: mod.duration,
      videoFile: null,
      videoUrl: mod.videoUrl
    }))
    setChapters(loadedChapters)
    
    setView('edit')
    toast.info('Editing course: ' + course.title)
  }

  // Handle update course
  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingCourse || !title || !description || !category) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setUploading(true)
      toast.info('Updating course...')

      // Process chapters
      const modulesWithVideos = await Promise.all(
        chapters.map(async (chapter) => {
          let videoUrl = chapter.videoUrl || ''
          
          if (chapter.videoFile) {
            try {
              videoUrl = await uploadVideoToStorage(chapter.videoFile, chapter.id)
              toast.success(`Uploaded video for ${chapter.title}`)
            } catch (error) {
              console.error(`Failed to upload video for chapter ${chapter.id}:`, error)
              toast.error(`Failed to upload video for ${chapter.title}`)
            }
          }

          return {
            id: chapter.id,
            title: chapter.title,
            duration: chapter.duration,
            videoUrl: videoUrl || undefined,
            completed: false
          }
        })
      )

      // Calculate total duration
      const totalMinutes = modulesWithVideos.reduce((sum, mod) => {
        const mins = parseInt(mod.duration) || 0
        return sum + mins
      }, 0)
      const hours = Math.floor(totalMinutes / 60)
      const mins = totalMinutes % 60
      const duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

      // Upload new thumbnail if provided
      let thumbnailUrl = editingCourse.thumbnail
      if (thumbnailFile) {
        try {
          thumbnailUrl = await uploadThumbnail(thumbnailFile)
          toast.success('Thumbnail uploaded successfully')
        } catch (error) {
          console.error('Failed to upload thumbnail:', error)
          toast.error('Failed to upload thumbnail, using existing')
        }
      }

      const courseData = {
        title,
        description,
        category,
        level,
        duration,
        instructor: editingCourse.instructor,
        instructorTitle: editingCourse.instructorTitle,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        thumbnail: thumbnailUrl,
        modules: modulesWithVideos
      }

      const result = await fetchFromServer(`/courses/${editingCourse.id}`, {
        method: 'PUT',
        body: JSON.stringify(courseData)
      })

      if (result.success) {
        toast.success('Course updated successfully!')
        resetForm()
        setEditingCourse(null)
        setView('list')
        loadMyCourses()
      } else {
        toast.error(result.error || 'Failed to update course')
      }
    } catch (error) {
      console.error('Course update error:', error)
      toast.error('Failed to update course')
    } finally {
      setUploading(false)
    }
  }

  // Handle delete course
  const handleDeleteCourse = async (course: Course, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigation

    if (!confirm(`Are you sure you want to delete "${course.title}"? This action cannot be undone.`)) {
      return
    }

    try {
      setLoading(true)
      toast.info('Deleting course...')

      const result = await fetchFromServer(`/courses/${course.id}`, {
        method: 'DELETE'
      })

      if (result.success) {
        toast.success('Course deleted successfully!')
        loadMyCourses()
      } else {
        toast.error(result.error || 'Failed to delete course')
      }
    } catch (error) {
      console.error('Course delete error:', error)
      toast.error('Failed to delete course')
    } finally {
      setLoading(false)
    }
  }

  if (view === 'create') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl">Create New Course</h1>
              <p className="text-gray-600 mt-1">Upload course content with videos and chapters</p>
            </div>
            <Button variant="outline" onClick={() => setView('list')}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
                <CardDescription>Basic details about your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Advanced Revit BIM Modeling"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what students will learn..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BIM">BIM</SelectItem>
                        <SelectItem value="MEPF">MEPF</SelectItem>
                        <SelectItem value="Architecture">Architecture</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="SOP">Standard Operating Procedures</SelectItem>
                        <SelectItem value="Compliance">Compliance & Safety</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="level">Level *</Label>
                    <Select value={level} onValueChange={(v) => setLevel(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., revit, modeling, 3d"
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g., 3D Modeling, BIM Coordination"
                  />
                </div>

                <div>
                  <Label htmlFor="thumbnail">Course Thumbnail</Label>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-sm text-gray-500 mt-1">Recommended: 800x450px, JPG or PNG</p>
                </div>
              </CardContent>
            </Card>

            {/* Chapters/Modules */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Course Chapters</CardTitle>
                    <CardDescription>Add video lessons and chapters</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Method Selection */}
                <div className="flex gap-4 mb-4">
                  <Button
                    type="button"
                    variant={uploadMethod === 'manual' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('manual')}
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Manual Upload
                  </Button>
                  <Button
                    type="button"
                    variant={uploadMethod === 'folder' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('folder')}
                    className="flex-1"
                  >
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Folder Upload
                  </Button>
                </div>

                {uploadMethod === 'folder' ? (
                  <>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <Label htmlFor="folderUpload" className="cursor-pointer">
                        <div className="text-lg mb-2">Upload Course Folder</div>
                        <p className="text-sm text-gray-600 mb-4">
                          Organize your course with folders as chapters.<br/>
                          Each subfolder will become a chapter with its videos.
                        </p>
                        <Input
                          id="folderUpload"
                          type="file"
                          /* @ts-ignore */
                          webkitdirectory=""
                          directory=""
                          multiple
                          onChange={handleFolderUpload}
                          className="hidden"
                        />
                        <Button type="button" variant="outline">
                          Select Folder
                        </Button>
                      </Label>
                    </div>

                    {folderChapters.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Detected Chapters ({folderChapters.length})</h4>
                        {folderChapters.map((chapter, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{chapter.name}</div>
                                <div className="text-sm text-gray-600">
                                  {chapter.videos.length} video(s)
                                </div>
                              </div>
                              <Badge variant="secondary">
                                <Video className="w-3 h-3 mr-1" />
                                Chapter {index + 1}
                              </Badge>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              {chapter.videos.map(v => v.name).join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex justify-end">
                      <Button type="button" onClick={addChapter} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Chapter
                      </Button>
                    </div>
                    {chapters.map((chapter, index) => (
                      <div key={chapter.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Chapter {index + 1}</h4>
                          {chapters.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeChapter(chapter.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Chapter Title *</Label>
                            <Input
                              value={chapter.title}
                              onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)}
                              placeholder="e.g., Introduction to BIM"
                              required
                            />
                          </div>
                          <div>
                            <Label>Duration (minutes) *</Label>
                            <Input
                              type="number"
                              value={chapter.duration}
                              onChange={(e) => updateChapter(chapter.id, 'duration', e.target.value)}
                              placeholder="e.g., 15"
                              min="1"
                              required
                            />
                          </div>
                        </div>

                        {/* Video Link Option */}
                        <div>
                          <Label>Video Link (Google Drive)</Label>
                          <Input
                            type="url"
                            value={chapter.videoUrl || ''}
                            onChange={(e) => updateChapter(chapter.id, 'videoUrl', e.target.value)}
                            placeholder="https://drive.google.com/file/d/..."
                          />
                          {chapter.videoUrl && (
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                Video link added
                              </Badge>
                            </div>
                          )}
                          <p className="text-sm text-gray-500 mt-1">
                            Paste a Google Drive video link (shareable link)
                          </p>
                        </div>

                        {/* Divider with OR text */}
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">OR</span>
                          </div>
                        </div>

                        <div>
                          <Label>Upload Video File</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="video/*"
                              onChange={(e) => updateChapter(chapter.id, 'videoFile', e.target.files?.[0] || null)}
                            />
                            {chapter.videoFile && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                {chapter.videoFile.name}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Supported: MP4, WebM, MOV</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setView('list')}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Course
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (view === 'create-path') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl">Create Learning Path</h1>
              <p className="text-gray-600 mt-1">Build a structured learning journey</p>
            </div>
            <Button variant="outline" onClick={() => setView('list')}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>

          <form onSubmit={handleCreateLearningPath} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Path Information</CardTitle>
                <CardDescription>Define your learning path details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pathTitle">Path Title *</Label>
                  <Input
                    id="pathTitle"
                    value={pathTitle}
                    onChange={(e) => setPathTitle(e.target.value)}
                    placeholder="e.g., BIM Specialist Certification"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="pathDescription">Description *</Label>
                  <Textarea
                    id="pathDescription"
                    value={pathDescription}
                    onChange={(e) => setPathDescription(e.target.value)}
                    placeholder="Describe the learning journey..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pathLevel">Level</Label>
                    <Select value={pathLevel} onValueChange={setPathLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="pathSkills">Skills (comma-separated)</Label>
                    <Input
                      id="pathSkills"
                      value={pathSkills}
                      onChange={(e) => setPathSkills(e.target.value)}
                      placeholder="e.g., BIM, Revit, Coordination"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Courses</CardTitle>
                <CardDescription>
                  Choose courses to include in this learning path
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="required">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="required">Required Courses</TabsTrigger>
                    <TabsTrigger value="optional">Optional Courses</TabsTrigger>
                  </TabsList>

                  <TabsContent value="required" className="space-y-3 mt-4">
                    {allCourses.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">
                        No courses available. Create courses first.
                      </p>
                    ) : (
                      allCourses.map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center gap-3 p-3 border rounded-lg hover:border-cyan-300 transition-colors"
                        >
                          <Checkbox
                            id={`req-${course.id}`}
                            checked={selectedCourses.includes(course.id)}
                            onCheckedChange={() => toggleCourseSelection(course.id, true)}
                          />
                          <Label htmlFor={`req-${course.id}`} className="flex-1 cursor-pointer">
                            <div className="font-medium">{course.title}</div>
                            <div className="text-sm text-gray-600">
                              {course.category} • {course.duration} • {course.modules?.length || 0} chapters
                            </div>
                          </Label>
                          <Badge variant="secondary">{course.level}</Badge>
                        </div>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="optional" className="space-y-3 mt-4">
                    {allCourses.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">
                        No courses available. Create courses first.
                      </p>
                    ) : (
                      allCourses.map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center gap-3 p-3 border rounded-lg hover:border-cyan-300 transition-colors"
                        >
                          <Checkbox
                            id={`opt-${course.id}`}
                            checked={optionalCourses.includes(course.id)}
                            onCheckedChange={() => toggleCourseSelection(course.id, false)}
                          />
                          <Label htmlFor={`opt-${course.id}`} className="flex-1 cursor-pointer">
                            <div className="font-medium">{course.title}</div>
                            <div className="text-sm text-gray-600">
                              {course.category} • {course.duration} • {course.modules?.length || 0} chapters
                            </div>
                          </Label>
                          <Badge variant="secondary">{course.level}</Badge>
                        </div>
                      ))
                    )}
                  </TabsContent>
                </Tabs>

                {selectedCourses.length > 0 && (
                  <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#E1F5FE' }}>
                    <p className="text-sm">
                      <strong>{selectedCourses.length}</strong> required course(s) selected
                      {optionalCourses.length > 0 && (
                        <>, <strong>{optionalCourses.length}</strong> optional course(s) selected</>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setView('list')}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Learning Path
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (view === 'edit') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl">Edit Course</h1>
              <p className="text-gray-600 mt-1">Upload course content with videos and chapters</p>
            </div>
            <Button variant="outline" onClick={() => setView('list')}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>

          <form onSubmit={handleUpdateCourse} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
                <CardDescription>Basic details about your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Advanced Revit BIM Modeling"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what students will learn..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BIM">BIM</SelectItem>
                        <SelectItem value="MEPF">MEPF</SelectItem>
                        <SelectItem value="Architecture">Architecture</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="SOP">Standard Operating Procedures</SelectItem>
                        <SelectItem value="Compliance">Compliance & Safety</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="level">Level *</Label>
                    <Select value={level} onValueChange={(v) => setLevel(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., revit, modeling, 3d"
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g., 3D Modeling, BIM Coordination"
                  />
                </div>

                <div>
                  <Label htmlFor="thumbnail">Course Thumbnail</Label>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-sm text-gray-500 mt-1">Recommended: 800x450px, JPG or PNG</p>
                </div>
              </CardContent>
            </Card>

            {/* Chapters/Modules */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Course Chapters</CardTitle>
                    <CardDescription>Add video lessons and chapters</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Method Selection */}
                <div className="flex gap-4 mb-4">
                  <Button
                    type="button"
                    variant={uploadMethod === 'manual' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('manual')}
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Manual Upload
                  </Button>
                  <Button
                    type="button"
                    variant={uploadMethod === 'folder' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('folder')}
                    className="flex-1"
                  >
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Folder Upload
                  </Button>
                </div>

                {uploadMethod === 'folder' ? (
                  <>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <Label htmlFor="folderUpload" className="cursor-pointer">
                        <div className="text-lg mb-2">Upload Course Folder</div>
                        <p className="text-sm text-gray-600 mb-4">
                          Organize your course with folders as chapters.<br/>
                          Each subfolder will become a chapter with its videos.
                        </p>
                        <Input
                          id="folderUpload"
                          type="file"
                          /* @ts-ignore */
                          webkitdirectory=""
                          directory=""
                          multiple
                          onChange={handleFolderUpload}
                          className="hidden"
                        />
                        <Button type="button" variant="outline">
                          Select Folder
                        </Button>
                      </Label>
                    </div>

                    {folderChapters.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Detected Chapters ({folderChapters.length})</h4>
                        {folderChapters.map((chapter, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{chapter.name}</div>
                                <div className="text-sm text-gray-600">
                                  {chapter.videos.length} video(s)
                                </div>
                              </div>
                              <Badge variant="secondary">
                                <Video className="w-3 h-3 mr-1" />
                                Chapter {index + 1}
                              </Badge>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              {chapter.videos.map(v => v.name).join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex justify-end">
                      <Button type="button" onClick={addChapter} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Chapter
                      </Button>
                    </div>
                    {chapters.map((chapter, index) => (
                      <div key={chapter.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Chapter {index + 1}</h4>
                          {chapters.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeChapter(chapter.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Chapter Title *</Label>
                            <Input
                              value={chapter.title}
                              onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)}
                              placeholder="e.g., Introduction to BIM"
                              required
                            />
                          </div>
                          <div>
                            <Label>Duration (minutes) *</Label>
                            <Input
                              type="number"
                              value={chapter.duration}
                              onChange={(e) => updateChapter(chapter.id, 'duration', e.target.value)}
                              placeholder="e.g., 15"
                              min="1"
                              required
                            />
                          </div>
                        </div>

                        {/* Video Link Option */}
                        <div>
                          <Label>Video Link (Google Drive)</Label>
                          <Input
                            type="url"
                            value={chapter.videoUrl || ''}
                            onChange={(e) => updateChapter(chapter.id, 'videoUrl', e.target.value)}
                            placeholder="https://drive.google.com/file/d/..."
                          />
                          {chapter.videoUrl && (
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                Video link added
                              </Badge>
                            </div>
                          )}
                          <p className="text-sm text-gray-500 mt-1">
                            Paste a Google Drive video link (shareable link)
                          </p>
                        </div>

                        {/* Divider with OR text */}
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">OR</span>
                          </div>
                        </div>

                        <div>
                          <Label>Upload Video File</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="video/*"
                              onChange={(e) => updateChapter(chapter.id, 'videoFile', e.target.files?.[0] || null)}
                            />
                            {chapter.videoFile && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                {chapter.videoFile.name}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Supported: MP4, WebM, MOV</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setView('list')}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Course
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // List view
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl">Instructor Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your courses and content</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setView('create')}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Course
            </Button>
            <Button onClick={() => setView('create-path')} variant="outline">
              <Route className="w-4 h-4 mr-2" />
              Create Learning Path
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Courses</CardDescription>
              <CardTitle className="text-3xl">{myCourses.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Enrollments</CardDescription>
              <CardTitle className="text-3xl">
                {myCourses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Average Rating</CardDescription>
              <CardTitle className="text-3xl">
                {myCourses.length > 0
                  ? (myCourses.reduce((sum, c) => sum + (c.rating || 0), 0) / myCourses.length).toFixed(1)
                  : '0.0'}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* My Courses */}
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>Courses you have created</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : myCourses.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg mb-2">No courses yet</h3>
                <p className="text-gray-600 mb-4">Start by creating your first course</p>
                <Button onClick={() => setView('create')}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Course
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {myCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => onNavigate('course', { id: course.id })}
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-32 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">{course.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{course.modules?.length || 0} chapters</span>
                        <span>{course.duration}</span>
                        <span>{course.enrollmentCount || 0} students</span>
                        <span>⭐ {course.rating?.toFixed(1) || '0.0'}</span>
                      </div>
                    </div>
                    <Badge>{course.level}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => handleEditCourse(course, e)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleDeleteCourse(course, e)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}