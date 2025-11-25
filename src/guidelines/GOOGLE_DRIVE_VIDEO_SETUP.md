# Google Drive Video Integration Guide
## Aided Modelling with Design AMD Learning Platform

---

## Overview

The **Aided Modelling with Design AMD** learning platform supports **Google Drive video embedding** with comprehensive **progress tracking**. This allows instructors to host their course videos on Google Drive and seamlessly integrate them into their courses while tracking student viewing progress.

---

## Table of Contents

1. [Why Google Drive?](#why-google-drive)
2. [Setting Up Videos on Google Drive](#setting-up-videos-on-google-drive)
3. [Getting the Video URL](#getting-the-video-url)
4. [Adding Videos to Course Modules](#adding-videos-to-course-modules)
5. [Supported URL Formats](#supported-url-formats)
6. [Video Progress Tracking](#video-progress-tracking)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Why Google Drive?

### Advantages:
- ✅ **Free Storage**: Google Drive offers 15GB free storage (more with paid plans)
- ✅ **Easy Sharing**: Simple sharing controls and link generation
- ✅ **High Availability**: Google's reliable infrastructure
- ✅ **No Special Setup**: Works with any Google account
- ✅ **Large File Support**: Supports video files up to 5TB
- ✅ **Streaming Optimized**: Videos stream directly without downloading

---

## Setting Up Videos on Google Drive

### Step 1: Upload Your Video

1. Go to [Google Drive](https://drive.google.com)
2. Click **"New"** → **"File upload"**
3. Select your video file (MP4, AVI, MOV, etc.)
4. Wait for the upload to complete

### Step 2: Set Sharing Permissions

1. Right-click on the uploaded video
2. Click **"Share"**
3. Under "General access", click **"Restricted"**
4. Change to **"Anyone with the link"**
5. Set permission to **"Viewer"**
6. Click **"Done"**

⚠️ **IMPORTANT**: Videos must be set to "Anyone with the link" with "Viewer" permissions to work on the platform.

---

## Getting the Video URL

### Method 1: From Share Dialog

1. Right-click the video → Click **"Share"**
2. Click **"Copy link"**
3. The URL will look like: `https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view?usp=sharing`

### Method 2: From Browser

1. Open the video in Google Drive
2. Copy the URL from your browser's address bar

---

## Adding Videos to Course Modules

When creating or editing a course in the **Instructor Dashboard**, you'll add videos to individual modules:

### In the Course Creation Form:

```
Module Title: Introduction to Revit Interface
Duration: 45 min
Video URL: https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view
```

### Example Course Module Structure:

```json
{
  "modules": [
    {
      "id": "m1",
      "title": "Introduction to Revit Interface",
      "duration": "45 min",
      "videoUrl": "https://drive.google.com/file/d/1AbC123xyz456/view",
      "videoDurationSeconds": 2700
    },
    {
      "id": "m2",
      "title": "Creating Walls and Floors",
      "duration": "60 min",
      "videoUrl": "https://drive.google.com/file/d/2DeF789abc012/view",
      "videoDurationSeconds": 3600
    }
  ]
}
```

---

## Supported URL Formats

The platform automatically extracts the file ID from these Google Drive URL formats:

### Format 1: Standard View Link
```
https://drive.google.com/file/d/{FILE_ID}/view
https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing
```

### Format 2: Open Link
```
https://drive.google.com/open?id={FILE_ID}
```

### Format 3: Direct File ID
```
1a2b3c4d5e6f7g8h9i0j
```

**Example:**
- ✅ `https://drive.google.com/file/d/1AbC123xyz456/view`
- ✅ `https://drive.google.com/open?id=1AbC123xyz456`
- ✅ `1AbC123xyz456`

---

## Video Progress Tracking

### Automatic Features:

1. **Resume Playback**: Students automatically resume from where they left off
2. **Progress Percentage**: Shows % watched for each module
3. **Auto-Complete**: Modules are automatically marked complete at 90% watched
4. **Visual Progress Bars**: Each module displays a progress bar showing watch progress
5. **Last Watched Position**: System remembers the exact second where students stopped

### Student Experience:

```
┌──────────────────────────────────────┐
│  Module: Introduction to Revit       │
│  45 minutes                           │
│  [████████░░] 75% watched            │
│                                       │
│  Resume from 33:45                    │
└──────────────────────────────────────┘
```

### Progress Data Stored:

For each module, the system tracks:
- **watchedSeconds**: Exact position in the video (e.g., 2025 seconds)
- **totalSeconds**: Total video duration (e.g., 2700 seconds)
- **percentage**: Watch percentage (e.g., 75%)
- **lastWatchedAt**: Timestamp of last viewing
- **completed**: Boolean (true if ≥90% watched)

---

## Best Practices

### Video File Recommendations:

1. **Format**: Use MP4 with H.264 codec for best compatibility
2. **Resolution**: 
   - Minimum: 720p (1280x720)
   - Recommended: 1080p (1920x1080)
   - Maximum: 4K (3840x2160)
3. **Bitrate**: 
   - 720p: 2-5 Mbps
   - 1080p: 5-10 Mbps
4. **Frame Rate**: 30fps or 60fps
5. **Audio**: AAC codec, 128-256 kbps

### File Naming Convention:

```
CourseID_ModuleNumber_ModuleName_vVersion.mp4
```

**Examples:**
- `BIM101_M01_IntroToRevit_v1.mp4`
- `MEPF201_M03_ClashDetection_v2.mp4`
- `PYTHON301_M05_APIIntegration_v1.mp4`

### Organization Tips:

1. **Create Folders**: Organize videos by course
   ```
   📁 AMD Courses
     📁 BIM 101 - Revit Fundamentals
       📹 Module 01 - Introduction
       📹 Module 02 - Creating Walls
       📹 Module 03 - Doors & Windows
     📁 MEPF 201 - MEP Coordination
       📹 Module 01 - Navisworks Overview
       📹 Module 02 - Clash Detection
   ```

2. **Use Consistent Duration**: Match `videoDurationSeconds` with actual video length

3. **Test Before Publishing**: Always test video playback before making course live

---

## Troubleshooting

### Common Issues and Solutions:

#### Issue: Video doesn't play
**Solutions:**
- ✅ Verify sharing permissions are set to "Anyone with the link"
- ✅ Check if the URL is correct
- ✅ Make sure the file is not corrupted
- ✅ Try opening the Google Drive link in an incognito window

#### Issue: Progress not saving
**Solutions:**
- ✅ Ensure student is logged in
- ✅ Check if student is enrolled in the course
- ✅ Verify backend is running properly
- ✅ Check browser console for errors

#### Issue: Video loads slowly
**Solutions:**
- ✅ Use smaller file sizes (compress videos)
- ✅ Lower video resolution
- ✅ Check student's internet connection
- ✅ Use Google's recommended video formats

#### Issue: "Invalid video URL" error
**Solutions:**
- ✅ Use one of the supported URL formats
- ✅ Copy the link directly from Google Drive
- ✅ Remove any extra parameters from URL
- ✅ Ensure file ID is correct (usually 25+ characters)

---

## Advanced Features

### Auto-Resume Notifications

When students return to a video they've previously watched, they'll see:
```
┌─────────────────────────────────────────┐
│  ℹ️ Resuming from 15:30                 │
│                                          │
│  Module: Creating Walls and Floors      │
│                                          │
│  [Start from beginning]                  │
└─────────────────────────────────────────┘
```

### Progress Indicators

In the course curriculum, students see:
- **Green checkmark**: Module 100% complete
- **Blue progress bar**: Module in progress (1-89%)
- **Play icon**: Module not started
- **Lock icon**: Module locked (for non-enrolled students)

### Completion Criteria

A module is automatically marked complete when:
1. Student watches ≥90% of the video OR
2. Instructor manually marks it complete

---

## API Reference (For Developers)

### Video Progress Endpoints:

#### Save Progress
```http
POST /video-progress
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "courseId": "course_123",
  "moduleId": "m1",
  "watchedSeconds": 1800,
  "totalSeconds": 2700,
  "percentage": 66.67
}
```

#### Get Module Progress
```http
GET /video-progress/{courseId}/{moduleId}
Authorization: Bearer {accessToken}
```

#### Get All Course Progress
```http
GET /video-progress/{courseId}
Authorization: Bearer {accessToken}
```

---

## Support

For additional help:
- 📧 Email: support@aidedmodelling.com
- 📚 Knowledge Base: [Instructor Help Center]
- 💬 Slack: #instructor-support
- 🎥 Video Tutorials: See "Instructor Onboarding" course

---

**Last Updated**: November 24, 2024
**Version**: 1.0
**Platform**: Aided Modelling with Design AMD Learning Platform
