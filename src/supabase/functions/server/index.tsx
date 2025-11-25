import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors())
app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// ========================================
// AUTH ROUTES
// ========================================

app.post('/make-server-efd95974/auth/signup', async (c) => {
  try {
    const { email, password, name, role = 'learner', organization } = await c.req.json()

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role, organization },
      email_confirm: true // Auto-confirm since email server not configured
    })

    if (authError) throw authError

    // Store user profile in KV
    await kv.set(`user:${authData.user.id}`, {
      id: authData.user.id,
      email,
      name,
      role, // learner, instructor, admin, org_manager
      organization,
      enrolledCourses: [],
      completedCourses: [],
      learningPaths: [],
      skills: [],
      createdAt: new Date().toISOString()
    })

    return c.json({ success: true, user: authData.user })
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ========================================
// USER ROUTES
// ========================================

app.get('/make-server-efd95974/users/me', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const userProfile = await kv.get(`user:${user.id}`)
    return c.json({ success: true, user: userProfile })
  } catch (error) {
    console.log('Get user error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

app.put('/make-server-efd95974/users/me', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const updates = await c.req.json()
    const currentProfile = await kv.get(`user:${user.id}`)
    const updatedProfile = { ...currentProfile, ...updates }
    
    await kv.set(`user:${user.id}`, updatedProfile)
    return c.json({ success: true, user: updatedProfile })
  } catch (error) {
    console.log('Update user error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ========================================
// COURSE ROUTES
// ========================================

app.get('/make-server-efd95974/courses', async (c) => {
  try {
    const { category, level, search, instructor, tags } = c.req.query()
    const courses = await kv.getByPrefix('course:')
    
    let filtered = courses
    if (category) filtered = filtered.filter(c => c.category === category)
    if (level) filtered = filtered.filter(c => c.level === level)
    if (instructor) filtered = filtered.filter(c => c.instructor === instructor)
    if (tags) {
      const tagList = tags.split(',')
      filtered = filtered.filter(c => c.tags?.some(t => tagList.includes(t)))
    }
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchLower) ||
        c.description?.toLowerCase().includes(searchLower)
      )
    }

    return c.json({ success: true, courses: filtered })
  } catch (error) {
    console.log('Get courses error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

app.get('/make-server-efd95974/courses/:id', async (c) => {
  try {
    const { id } = c.req.param()
    console.log('Fetching course with ID:', id)
    const course = await kv.get(`course:${id}`)
    console.log('Course found:', course ? 'Yes' : 'No', course ? `(${course.title})` : '')
    
    if (!course) {
      console.log('Course not found in KV store for ID:', id)
      return c.json({ success: false, error: 'Course not found' }, 404)
    }

    return c.json({ success: true, course })
  } catch (error) {
    console.log('Get course error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

app.post('/make-server-efd95974/courses', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const userProfile = await kv.get(`user:${user.id}`)
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'instructor') {
      return c.json({ success: false, error: 'Forbidden' }, 403)
    }

    const courseData = await c.req.json()
    const courseId = `course_${Date.now()}`
    
    const course = {
      id: courseId,
      ...courseData,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      enrollmentCount: 0,
      rating: 0,
      reviewCount: 0
    }

    await kv.set(`course:${courseId}`, course)
    return c.json({ success: true, course })
  } catch (error) {
    console.log('Create course error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

app.put('/make-server-efd95974/courses/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const userProfile = await kv.get(`user:${user.id}`)
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'instructor') {
      return c.json({ success: false, error: 'Forbidden' }, 403)
    }

    const { id } = c.req.param()
    const updates = await c.req.json()
    const currentCourse = await kv.get(`course:${id}`)
    
    if (!currentCourse) {
      return c.json({ success: false, error: 'Course not found' }, 404)
    }

    const updatedCourse = { ...currentCourse, ...updates, updatedAt: new Date().toISOString() }
    await kv.set(`course:${id}`, updatedCourse)
    
    return c.json({ success: true, course: updatedCourse })
  } catch (error) {
    console.log('Update course error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

app.delete('/make-server-efd95974/courses/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const userProfile = await kv.get(`user:${user.id}`)
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'instructor') {
      return c.json({ success: false, error: 'Forbidden' }, 403)
    }

    const { id } = c.req.param()
    const currentCourse = await kv.get(`course:${id}`)
    
    if (!currentCourse) {
      return c.json({ success: false, error: 'Course not found' }, 404)
    }

    // Only allow deletion if user is the creator or an admin
    if (currentCourse.createdBy !== user.id && userProfile?.role !== 'admin') {
      return c.json({ success: false, error: 'You can only delete your own courses' }, 403)
    }

    await kv.del(`course:${id}`)
    
    return c.json({ success: true, message: 'Course deleted successfully' })
  } catch (error) {
    console.log('Delete course error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ========================================
// ENROLLMENT ROUTES
// ========================================

app.post('/make-server-efd95974/enrollments', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const { courseId } = await c.req.json()
    const enrollmentId = `enrollment:${user.id}:${courseId}`
    
    const enrollment = {
      id: enrollmentId,
      userId: user.id,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      completedModules: [],
      lastAccessedAt: new Date().toISOString(),
      status: 'in_progress'
    }

    await kv.set(enrollmentId, enrollment)

    // Update user's enrolled courses
    const userProfile = await kv.get(`user:${user.id}`)
    userProfile.enrolledCourses = [...(userProfile.enrolledCourses || []), courseId]
    await kv.set(`user:${user.id}`, userProfile)

    // Update course enrollment count
    const course = await kv.get(`course:${courseId}`)
    course.enrollmentCount = (course.enrollmentCount || 0) + 1
    await kv.set(`course:${courseId}`, course)

    return c.json({ success: true, enrollment })
  } catch (error) {
    console.log('Enrollment error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

app.get('/make-server-efd95974/enrollments/my-courses', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const enrollments = await kv.getByPrefix(`enrollment:${user.id}:`)
    const courseIds = enrollments.map(e => e.courseId)
    const courses = await kv.mget(courseIds.map(id => `course:${id}`))
    
    const enrichedEnrollments = enrollments.map((enrollment, idx) => ({
      ...enrollment,
      course: courses[idx]
    }))

    return c.json({ success: true, enrollments: enrichedEnrollments })
  } catch (error) {
    console.log('Get enrollments error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

app.put('/make-server-efd95974/enrollments/:courseId/progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const { courseId } = c.req.param()
    const { moduleId, progress, completed } = await c.req.json()
    
    const enrollmentId = `enrollment:${user.id}:${courseId}`
    const enrollment = await kv.get(enrollmentId)
    
    if (!enrollment) {
      return c.json({ success: false, error: 'Enrollment not found' }, 404)
    }

    if (moduleId && !enrollment.completedModules.includes(moduleId)) {
      enrollment.completedModules.push(moduleId)
    }
    
    enrollment.progress = progress !== undefined ? progress : enrollment.progress
    enrollment.lastAccessedAt = new Date().toISOString()
    
    if (completed) {
      enrollment.status = 'completed'
      enrollment.completedAt = new Date().toISOString()
      
      // Update user's completed courses
      const userProfile = await kv.get(`user:${user.id}`)
      if (!userProfile.completedCourses.includes(courseId)) {
        userProfile.completedCourses.push(courseId)
        await kv.set(`user:${user.id}`, userProfile)
      }
    }

    await kv.set(enrollmentId, enrollment)
    return c.json({ success: true, enrollment })
  } catch (error) {
    console.log('Update progress error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ========================================
// VIDEO PROGRESS ROUTES
// ========================================

app.post('/make-server-efd95974/video-progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const { courseId, moduleId, watchedSeconds, totalSeconds, percentage } = await c.req.json()
    
    const progressId = `video_progress:${user.id}:${courseId}:${moduleId}`
    const videoProgress = {
      moduleId,
      courseId,
      userId: user.id,
      watchedSeconds,
      totalSeconds,
      percentage,
      lastWatchedAt: new Date().toISOString(),
      completed: percentage >= 90 // Consider 90% as completed
    }

    await kv.set(progressId, videoProgress)
    
    // Auto-mark module as complete if video is 90% watched
    if (videoProgress.completed) {
      const enrollmentId = `enrollment:${user.id}:${courseId}`
      const enrollment = await kv.get(enrollmentId)
      
      if (enrollment && !enrollment.completedModules.includes(moduleId)) {
        enrollment.completedModules.push(moduleId)
        
        // Calculate overall course progress
        const course = await kv.get(`course:${courseId}`)
        const courseProgress = (enrollment.completedModules.length / (course?.modules?.length || 1)) * 100
        enrollment.progress = courseProgress
        
        if (courseProgress >= 100) {
          enrollment.status = 'completed'
          enrollment.completedAt = new Date().toISOString()
          
          const userProfile = await kv.get(`user:${user.id}`)
          if (!userProfile.completedCourses.includes(courseId)) {
            userProfile.completedCourses.push(courseId)
            await kv.set(`user:${user.id}`, userProfile)
          }
        }
        
        await kv.set(enrollmentId, enrollment)
      }
    }

    return c.json({ success: true, videoProgress })
  } catch (error) {
    console.log('Save video progress error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

app.get('/make-server-efd95974/video-progress/:courseId/:moduleId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const { courseId, moduleId } = c.req.param()
    const progressId = `video_progress:${user.id}:${courseId}:${moduleId}`
    const videoProgress = await kv.get(progressId)

    return c.json({ success: true, videoProgress })
  } catch (error) {
    console.log('Get video progress error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

app.get('/make-server-efd95974/video-progress/:courseId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const { courseId } = c.req.param()
    const allProgress = await kv.getByPrefix(`video_progress:${user.id}:${courseId}:`)

    return c.json({ success: true, videoProgress: allProgress })
  } catch (error) {
    console.log('Get course video progress error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ========================================
// LEARNING PATH ROUTES
// ========================================

app.get('/make-server-efd95974/learning-paths', async (c) => {
  try {
    const paths = await kv.getByPrefix('path:')
    return c.json({ success: true, paths })
  } catch (error) {
    console.log('Get paths error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

app.get('/make-server-efd95974/learning-paths/:id', async (c) => {
  try {
    const { id } = c.req.param()
    const path = await kv.get(`path:${id}`)
    
    if (!path) {
      return c.json({ success: false, error: 'Path not found' }, 404)
    }

    // Enrich with course details
    const courseIds = [...path.requiredCourses, ...(path.optionalCourses || [])]
    const courses = await kv.mget(courseIds.map(id => `course:${id}`))
    
    const enrichedPath = {
      ...path,
      courses: courses.filter(Boolean)
    }

    return c.json({ success: true, path: enrichedPath })
  } catch (error) {
    console.log('Get path error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

app.post('/make-server-efd95974/learning-paths', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const userProfile = await kv.get(`user:${user.id}`)
    if (userProfile?.role !== 'admin') {
      return c.json({ success: false, error: 'Forbidden' }, 403)
    }

    const pathData = await c.req.json()
    const pathId = `path_${Date.now()}`
    
    const path = {
      id: pathId,
      ...pathData,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      enrollmentCount: 0
    }

    await kv.set(`path:${pathId}`, path)
    return c.json({ success: true, path })
  } catch (error) {
    console.log('Create path error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ========================================
// ANALYTICS ROUTES
// ========================================

app.get('/make-server-efd95974/analytics/overview', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const userProfile = await kv.get(`user:${user.id}`)
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'org_manager') {
      return c.json({ success: false, error: 'Forbidden' }, 403)
    }

    const users = await kv.getByPrefix('user:')
    const courses = await kv.getByPrefix('course:')
    const enrollments = await kv.getByPrefix('enrollment:')
    const paths = await kv.getByPrefix('path:')

    const analytics = {
      totalUsers: users.length,
      totalCourses: courses.length,
      totalEnrollments: enrollments.length,
      totalLearningPaths: paths.length,
      activeUsers: users.filter(u => u.enrolledCourses?.length > 0).length,
      completionRate: enrollments.filter(e => e.status === 'completed').length / enrollments.length * 100,
      averageProgress: enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length,
      topCourses: courses
        .sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0))
        .slice(0, 10),
      recentEnrollments: enrollments
        .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
        .slice(0, 20)
    }

    return c.json({ success: true, analytics })
  } catch (error) {
    console.log('Analytics error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

app.get('/make-server-efd95974/analytics/user-progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const enrollments = await kv.getByPrefix(`enrollment:${user.id}:`)
    const courseIds = enrollments.map(e => e.courseId)
    const courses = await kv.mget(courseIds.map(id => `course:${id}`))

    const progress = {
      totalEnrolled: enrollments.length,
      inProgress: enrollments.filter(e => e.status === 'in_progress').length,
      completed: enrollments.filter(e => e.status === 'completed').length,
      averageProgress: enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length,
      courses: enrollments.map((e, idx) => ({
        ...e,
        course: courses[idx]
      }))
    }

    return c.json({ success: true, progress })
  } catch (error) {
    console.log('User progress error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ========================================
// VIDEO UPLOAD ROUTES
// ========================================

// Create storage bucket on startup
const VIDEO_BUCKET = 'make-efd95974-videos'
const initializeStorage = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === VIDEO_BUCKET)
    if (!bucketExists) {
      await supabase.storage.createBucket(VIDEO_BUCKET, {
        public: false,
        fileSizeLimit: 524288000 // 500MB
      })
      console.log(`Created storage bucket: ${VIDEO_BUCKET}`)
    }
  } catch (error) {
    console.log('Storage initialization error:', error)
  }
}

// Initialize storage on server start
initializeStorage()

app.post('/make-server-efd95974/upload/video', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const userProfile = await kv.get(`user:${user.id}`)
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'instructor') {
      return c.json({ success: false, error: 'Forbidden' }, 403)
    }

    const formData = await c.req.formData()
    const file = formData.get('video')
    const chapterId = formData.get('chapterId')
    
    if (!file || !(file instanceof File)) {
      return c.json({ success: false, error: 'No video file provided' }, 400)
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${user.id}/${timestamp}_${chapterId}_${file.name}`
    
    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    
    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(VIDEO_BUCKET)
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.log('Video upload error:', uploadError)
      return c.json({ success: false, error: uploadError.message }, 500)
    }

    // Generate signed URL (valid for 1 year)
    const { data: signedUrlData } = await supabase.storage
      .from(VIDEO_BUCKET)
      .createSignedUrl(fileName, 31536000) // 1 year in seconds

    return c.json({ 
      success: true, 
      videoUrl: signedUrlData.signedUrl,
      path: fileName 
    })
  } catch (error) {
    console.log('Upload video error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

app.post('/make-server-efd95974/upload/thumbnail', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const userProfile = await kv.get(`user:${user.id}`)
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'instructor') {
      return c.json({ success: false, error: 'Forbidden' }, 403)
    }

    const formData = await c.req.formData()
    const file = formData.get('thumbnail')
    
    if (!file || !(file instanceof File)) {
      return c.json({ success: false, error: 'No thumbnail file provided' }, 400)
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${user.id}/thumbnails/${timestamp}_${file.name}`
    
    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    
    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(VIDEO_BUCKET)
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.log('Thumbnail upload error:', uploadError)
      return c.json({ success: false, error: uploadError.message }, 500)
    }

    // Generate signed URL (valid for 1 year)
    const { data: signedUrlData } = await supabase.storage
      .from(VIDEO_BUCKET)
      .createSignedUrl(fileName, 31536000)

    return c.json({ 
      success: true, 
      thumbnailUrl: signedUrlData.signedUrl,
      path: fileName 
    })
  } catch (error) {
    console.log('Upload thumbnail error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ========================================
// SEED DATA (For Demo)
// ========================================

app.post('/make-server-efd95974/seed-data', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const userProfile = await kv.get(`user:${user.id}`)
    if (userProfile?.role !== 'admin') {
      return c.json({ success: false, error: 'Forbidden' }, 403)
    }

    // Create sample courses
    const sampleCourses = [
      {
        id: 'course_revit_basics',
        title: 'Revit Fundamentals for Architects',
        description: 'Master the basics of Autodesk Revit for architectural design and BIM workflows.',
        category: 'BIM',
        level: 'Beginner',
        duration: '8 hours',
        instructor: 'Sarah Johnson',
        instructorTitle: 'Senior BIM Manager',
        tags: ['Revit', 'BIM', 'Architecture'],
        skills: ['3D Modeling', 'BIM Coordination', 'Documentation'],
        thumbnail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
        modules: [
          { id: 'm1', title: 'Introduction to Revit Interface', duration: '45 min', videoUrl: '' },
          { id: 'm2', title: 'Creating Walls and Floors', duration: '60 min', videoUrl: '' },
          { id: 'm3', title: 'Working with Doors and Windows', duration: '50 min', videoUrl: '' },
          { id: 'm4', title: 'Stairs and Railings', duration: '55 min', videoUrl: '' },
          { id: 'm5', title: 'Creating Schedules', duration: '40 min', videoUrl: '' }
        ],
        enrollmentCount: 145,
        rating: 4.8,
        reviewCount: 52,
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'course_mep_coordination',
        title: 'MEP Coordination in Navisworks',
        description: 'Learn clash detection and coordination workflows for MEP systems.',
        category: 'MEPF',
        level: 'Intermediate',
        duration: '6 hours',
        instructor: 'Michael Chen',
        instructorTitle: 'MEP BIM Specialist',
        tags: ['Navisworks', 'MEP', 'Clash Detection'],
        skills: ['Clash Detection', 'Coordination', 'Model Review'],
        thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
        modules: [
          { id: 'm1', title: 'Navisworks Interface Overview', duration: '30 min', videoUrl: '' },
          { id: 'm2', title: 'Importing and Federating Models', duration: '45 min', videoUrl: '' },
          { id: 'm3', title: 'Clash Detection Setup', duration: '60 min', videoUrl: '' },
          { id: 'm4', title: 'Managing Clash Reports', duration: '50 min', videoUrl: '' }
        ],
        enrollmentCount: 98,
        rating: 4.6,
        reviewCount: 34,
        createdAt: '2024-02-10T10:00:00Z'
      },
      {
        id: 'course_python_automation',
        title: 'Python Automation for AEC',
        description: 'Automate repetitive tasks in your AEC workflows using Python scripting.',
        category: 'Software Development',
        level: 'Advanced',
        duration: '10 hours',
        instructor: 'David Park',
        instructorTitle: 'Computational Designer',
        tags: ['Python', 'Automation', 'Scripting'],
        skills: ['Python Programming', 'API Integration', 'Workflow Automation'],
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
        modules: [
          { id: 'm1', title: 'Python Basics', duration: '90 min', videoUrl: '' },
          { id: 'm2', title: 'Working with Revit API', duration: '120 min', videoUrl: '' },
          { id: 'm3', title: 'Data Processing with Pandas', duration: '75 min', videoUrl: '' },
          { id: 'm4', title: 'Building Custom Tools', duration: '90 min', videoUrl: '' }
        ],
        enrollmentCount: 67,
        rating: 4.9,
        reviewCount: 28,
        createdAt: '2024-03-05T10:00:00Z'
      }
    ]

    for (const course of sampleCourses) {
      await kv.set(`course:${course.id}`, course)
    }

    // Create sample learning paths
    const samplePaths = [
      {
        id: 'path_bim_mastery',
        title: 'BIM Professional Certification Path',
        description: 'Complete certification path for BIM professionals covering Revit, Navisworks, and coordination.',
        requiredCourses: ['course_revit_basics', 'course_mep_coordination'],
        optionalCourses: ['course_python_automation'],
        estimatedDuration: '14 hours',
        skills: ['BIM', '3D Modeling', 'Coordination', 'Clash Detection'],
        level: 'Beginner to Intermediate',
        enrollmentCount: 45,
        createdAt: '2024-01-20T10:00:00Z'
      }
    ]

    for (const path of samplePaths) {
      await kv.set(`path:${path.id}`, path)
    }

    return c.json({ success: true, message: 'Sample data created successfully' })
  } catch (error) {
    console.log('Seed data error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ========================================
// INITIALIZE DEMO USER
// ========================================

async function initializeDemoUser() {
  try {
    // Check if demo user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const demoExists = existingUsers?.users?.some(u => u.email === 'demo@amd.com')
    
    if (!demoExists) {
      console.log('Creating demo user...')
      
      // Create demo user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'demo@amd.com',
        password: 'password123',
        user_metadata: { 
          name: 'Demo User', 
          role: 'instructor', 
          organization: 'AMD Demo' 
        },
        email_confirm: true
      })

      if (authError) {
        console.error('Failed to create demo user:', authError)
        return
      }

      // Store user profile
      await kv.set(`user:${authData.user.id}`, {
        id: authData.user.id,
        email: 'demo@amd.com',
        name: 'Demo User',
        role: 'instructor',
        organization: 'AMD Demo',
        enrolledCourses: [],
        completedCourses: [],
        learningPaths: [],
        skills: ['BIM', 'Revit', 'AutoCAD'],
        createdAt: new Date().toISOString()
      })

      console.log('Demo user created successfully!')
    } else {
      console.log('Demo user already exists')
    }
  } catch (error) {
    console.error('Error initializing demo user:', error)
  }
}

// Initialize demo user on startup
initializeDemoUser()

Deno.serve(app.fetch)