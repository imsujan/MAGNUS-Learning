import { Clock, Star, Users, BookOpen } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import type { Course } from '../lib/types'

interface CourseCardProps {
  course: Course
  onSelect: (courseId: string) => void
  enrolled?: boolean
  progress?: number
}

export function CourseCard({ course, onSelect, enrolled, progress }: CourseCardProps) {
  return (
    <div 
      className="bg-white rounded-lg border hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => onSelect(course.id)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90">
            {course.level}
          </Badge>
        </div>
        {enrolled && progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: '#03A9F4' }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="text-xs" style={{ color: '#03A9F4' }}>{course.category}</div>

        {/* Title */}
        <h3 className="line-clamp-2 min-h-[3rem]">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="text-sm text-gray-700">
          {course.instructor}
          {course.instructorTitle && (
            <span className="text-gray-500"> • {course.instructorTitle}</span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {course.enrollmentCount}
          </div>
          {course.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {course.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Skills */}
        {course.skills && course.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {course.skills.slice(0, 3).map((skill, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        {/* Progress for enrolled courses */}
        {enrolled && progress !== undefined && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
