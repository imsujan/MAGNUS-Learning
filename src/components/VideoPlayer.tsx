import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, X } from 'lucide-react'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import { toast } from 'sonner@2.0.3'

interface VideoPlayerProps {
  videoUrl: string
  moduleId: string
  moduleTitle: string
  videoDuration?: number // Duration in seconds (if known)
  lastWatchedPosition?: number // in seconds
  onProgressUpdate: (progress: { watchedSeconds: number; totalSeconds: number; percentage: number }) => void
  onClose: () => void
  autoResume?: boolean
}

// Helper function to extract Google Drive file ID from various URL formats
const extractGoogleDriveFileId = (url: string): string | null => {
  // Format 1: https://drive.google.com/file/d/{fileId}/view
  const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (match1) return match1[1]
  
  // Format 2: https://drive.google.com/open?id={fileId}
  const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (match2) return match2[1]
  
  // Format 3: Just the file ID
  if (url.match(/^[a-zA-Z0-9_-]{25,}$/)) return url
  
  return null
}

// Construct Google Drive embed URL for iframe
const constructGoogleDriveEmbedUrl = (fileId: string): string => {
  return `https://drive.google.com/file/d/${fileId}/preview`
}

// Helper function to detect and format SharePoint video URLs
const extractSharePointVideoUrl = (url: string): string | null => {
  // SharePoint video URLs typically look like:
  // https://{tenant}.sharepoint.com/:v:/s/{site}/...
  // https://{tenant}.sharepoint.com/sites/{site}/...
  // https://{tenant}-my.sharepoint.com/...
  
  if (url.includes('sharepoint.com')) {
    // If it's already an embed URL, return as-is
    if (url.includes('/embed')) {
      return url
    }
    
    // If it's a video link (:v:), convert to embed format
    if (url.includes(':v:')) {
      // SharePoint video links can be embedded directly
      return url.replace('/view.aspx', '/embed').replace('?', '?embed=')
    }
    
    // For direct file links, try to convert to embed
    if (url.includes('/_layouts/15/') || url.includes('/Shared%20Documents/')) {
      // Append embed parameter
      return url + (url.includes('?') ? '&' : '?') + 'action=embedview'
    }
    
    // Return as-is and let SharePoint handle it
    return url
  }
  
  return null
}

// Detect video source type
const detectVideoSource = (url: string): 'google-drive' | 'sharepoint' | 'unknown' => {
  if (url.includes('drive.google.com')) return 'google-drive'
  if (url.includes('sharepoint.com')) return 'sharepoint'
  return 'unknown'
}

export function VideoPlayer({
  videoUrl,
  moduleId,
  moduleTitle,
  videoDuration,
  lastWatchedPosition = 0,
  onProgressUpdate,
  onClose,
  autoResume = true
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [watchStartTime, setWatchStartTime] = useState<number>(Date.now())
  const [estimatedProgress, setEstimatedProgress] = useState(lastWatchedPosition)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Detect video source and get embed URL
  const videoSource = detectVideoSource(videoUrl)
  let embedUrl: string | null = null
  let sourceName = ''

  if (videoSource === 'google-drive') {
    const fileId = extractGoogleDriveFileId(videoUrl)
    embedUrl = fileId ? constructGoogleDriveEmbedUrl(fileId) : null
    sourceName = 'Google Drive'
  } else if (videoSource === 'sharepoint') {
    embedUrl = extractSharePointVideoUrl(videoUrl)
    sourceName = 'SharePoint'
  }

  useEffect(() => {
    if (!embedUrl) {
      setError(`Invalid ${sourceName || 'video'} URL`)
      toast.error(`Invalid ${sourceName || 'video'} URL. Please check the link.`)
      return
    }
  }, [embedUrl, sourceName])

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false)
    setError(null)
    toast.success('Video loaded successfully!')
    
    // Start tracking watch time
    setWatchStartTime(Date.now())
    
    // Update progress every 10 seconds
    progressIntervalRef.current = setInterval(() => {
      const watchedSeconds = (Date.now() - watchStartTime) / 1000 + lastWatchedPosition
      const totalSeconds = videoDuration || 0
      const percentage = totalSeconds > 0 ? (watchedSeconds / totalSeconds) * 100 : 0
      
      setEstimatedProgress(watchedSeconds)
      
      if (totalSeconds > 0) {
        onProgressUpdate({
          watchedSeconds: Math.min(watchedSeconds, totalSeconds),
          totalSeconds,
          percentage: Math.min(percentage, 100)
        })
      }
    }, 10000) // Update every 10 seconds
  }

  // Handle iframe error
  const handleIframeError = () => {
    setError('Failed to load video. Please ensure the link is set to "Anyone with the link can view".')
    setIsLoading(false)
    toast.error('Failed to load video. Check link settings.')
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      
      // Save final progress
      if (videoDuration && estimatedProgress > 0) {
        const watchedSeconds = Math.min(estimatedProgress, videoDuration)
        const percentage = (watchedSeconds / videoDuration) * 100
        
        onProgressUpdate({
          watchedSeconds,
          totalSeconds: videoDuration,
          percentage: Math.min(percentage, 100)
        })
      }
    }
  }, [estimatedProgress, videoDuration])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!embedUrl || error) {
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center rounded-lg">
        <div className="text-center text-white p-8 max-w-lg">
          <X className="h-16 w-16 mx-auto mb-4 text-red-400" />
          <h3 className="text-xl mb-4">{error || 'Invalid video URL'}</h3>
          <div className="text-sm text-gray-400 mb-6 space-y-2">
            <p>To fix this issue:</p>
            <ol className="text-left list-decimal list-inside space-y-1">
              <li>Open the video in {sourceName}</li>
              <li>Click "Share" button</li>
              <li>Change access to "Anyone with the link"</li>
              <li>Set permission to "Viewer"</li>
              <li>Copy and use the new link</li>
            </ol>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      {/* Video Container */}
      <div className="relative aspect-video">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
        
        {/* Close Button Overlay */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors z-10 backdrop-blur-sm"
          title="Close player"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Loading overlay */}
        {isLoading && !error && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4" />
              <p className="text-lg">Loading video from {sourceName}...</p>
              <p className="text-sm text-gray-400 mt-2">This may take a few seconds</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Info Bar */}
      <div className="bg-gradient-to-t from-black to-gray-900 p-4 space-y-3">
        {/* Module Title */}
        <div className="text-white">
          <p className="text-sm text-gray-400">Now watching:</p>
          <p className="font-medium">{moduleTitle}</p>
        </div>

        {/* Progress Info */}
        {videoDuration && videoDuration > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-300">
              <span className="text-cyan-400">{formatTime(estimatedProgress)}</span>
              <span className="text-gray-500"> / </span>
              <span>{formatTime(videoDuration)}</span>
            </div>
            <div className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">
              {((estimatedProgress / videoDuration) * 100).toFixed(1)}% completed
            </div>
          </div>
        )}

        {/* Auto-resume notification */}
        {autoResume && lastWatchedPosition > 0 && (
          <div className="text-sm text-cyan-400 bg-cyan-500/10 px-3 py-2 rounded">
            ℹ️ Progress tracking enabled - Your progress will be saved automatically
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-gray-500 border-t border-gray-800 pt-3">
          <p>💡 Tip: Use {sourceName}'s built-in player controls for playback. Your progress is tracked automatically.</p>
        </div>
      </div>
    </div>
  )
}