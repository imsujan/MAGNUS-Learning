# Chapter Video Links Guide

## Adding Video Links to Course Chapters

When creating a new course, you can now add video links directly to each chapter instead of uploading video files. This is particularly useful for embedding Google Drive videos.

## How to Use

### Step 1: Navigate to Course Creation
1. Go to the Instructor Dashboard
2. Click "Upload Course" button
3. Select "Manual Upload" for chapter management

### Step 2: Add Chapter Video Link
For each chapter, you have two options:

#### Option A: Google Drive Video Link (Recommended)
1. Fill in **Chapter Title** and **Duration**
2. In the **Video Link (Google Drive)** field, paste your Google Drive video URL
   - Example: `https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view`
3. Make sure the Google Drive link is set to "Anyone with the link can view"

#### Option B: Upload Video File
1. Fill in **Chapter Title** and **Duration**
2. Click "Upload Video File" and select a video from your computer
3. Supported formats: MP4, WebM, MOV

**Note:** You can use EITHER a video link OR upload a file for each chapter. If both are provided, the video link will be prioritized.

## Google Drive Video Setup

To properly share a Google Drive video for your course:

1. **Upload your video to Google Drive**
2. **Right-click the video file** and select "Get link"
3. **Change sharing settings** to "Anyone with the link"
4. **Set permission** to "Viewer"
5. **Copy the link** and paste it into the "Video Link" field

### Link Format
The link should look like one of these formats:
- `https://drive.google.com/file/d/FILE_ID/view`
- `https://drive.google.com/open?id=FILE_ID`

## Benefits of Using Video Links

✅ **No upload time** - Instantly add videos without waiting for uploads  
✅ **No storage limits** - Videos stored in your Google Drive  
✅ **Easy updates** - Replace video content without recreating the course  
✅ **Progress tracking** - The system still tracks how much students have watched  
✅ **Reliable playback** - Powered by Google Drive's infrastructure  

## Video Progress Tracking

Whether you use a video link or upload a file, the platform automatically tracks:
- Which videos each student has started watching
- How much of each video has been watched (percentage)
- Last watched position in each video
- Overall chapter completion status

For more details about the video progress system, see [VIDEO_PROGRESS_SYSTEM.md](./VIDEO_PROGRESS_SYSTEM.md).

## Troubleshooting

### Video Link Not Working?
1. Verify the link is publicly accessible
2. Check that sharing is set to "Anyone with the link"
3. Ensure the link includes the file ID
4. Try opening the link in an incognito browser window

### Video Not Playing?
1. Ensure the Google Drive video is not restricted
2. Check your internet connection
3. Try refreshing the page
4. Verify the video format is supported by browsers

## Example: Creating a Complete Course

```
Course: "Introduction to BIM Modeling"

Chapter 1:
- Title: "What is BIM?"
- Duration: 12 (minutes)
- Video Link: https://drive.google.com/file/d/abc123xyz/view

Chapter 2:
- Title: "Getting Started with Revit"
- Duration: 25 (minutes)
- Video Link: https://drive.google.com/file/d/def456uvw/view

Chapter 3:
- Title: "Your First Model"
- Duration: 30 (minutes)
- Video Link: https://drive.google.com/file/d/ghi789rst/view
```

## Related Documentation

- [GOOGLE_DRIVE_VIDEO_SETUP.md](./GOOGLE_DRIVE_VIDEO_SETUP.md) - Complete Google Drive integration guide
- [VIDEO_PROGRESS_SYSTEM.md](./VIDEO_PROGRESS_SYSTEM.md) - Video progress tracking documentation
- [INSTRUCTOR_MANUAL.md](./INSTRUCTOR_MANUAL.md) - Complete instructor guide
- [COURSE_TEMPLATE.md](./COURSE_TEMPLATE.md) - Course structure templates

---

**Quick Tip:** You can mix and match video links and uploaded files within the same course. For example, use Google Drive links for long tutorial videos and upload short intro clips directly.
