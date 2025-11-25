# Microsoft Authentication & SharePoint Video Setup Guide

## Overview
This guide will help you configure Microsoft OAuth authentication and SharePoint video embedding for your learning platform.

## Features Implemented

### 1. **Microsoft OAuth Authentication**
- Users can sign in with their Microsoft/Azure AD accounts
- Single Sign-On (SSO) experience
- Automatic user profile creation from Microsoft account

### 2. **SharePoint Video Support**
- Embed SharePoint videos directly in courses
- Authenticated access using user's Microsoft session
- Users with SharePoint access automatically have video access
- Progress tracking works with SharePoint videos

### 3. **Google Drive Video Support (Already Working)**
- Continue using Google Drive videos with public sharing
- Both platforms work side-by-side

---

## Setup Instructions

### Part 1: Configure Azure AD (Microsoft OAuth)

#### Step 1: Create Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the details:
   - **Name**: `AMD Learning Platform` (or your preferred name)
   - **Supported account types**: Choose based on your needs:
     - `Accounts in this organizational directory only` - Single tenant (your organization only)
     - `Accounts in any organizational directory` - Multi-tenant (any Microsoft org)
     - `Accounts in any organizational directory and personal Microsoft accounts` - Broadest access
   - **Redirect URI**: 
     - Platform: `Web`
     - URI: `https://{your-supabase-project-id}.supabase.co/auth/v1/callback`
5. Click **Register**

#### Step 2: Get Application Credentials

1. After registration, you'll see the **Overview** page
2. **Copy these values** (you'll need them later):
   - **Application (client) ID**
   - **Directory (tenant) ID**

#### Step 3: Create Client Secret

1. In your app registration, go to **Certificates & secrets**
2. Click **New client secret**
3. Add a description (e.g., "Supabase OAuth")
4. Choose expiration (recommend 24 months)
5. Click **Add**
6. **IMPORTANT**: Copy the **Value** immediately (it won't be shown again)

#### Step 4: Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Choose **Delegated permissions**
5. Add these permissions:
   - `email`
   - `openid`
   - `profile`
   - `User.Read`
6. Click **Add permissions**
7. (Optional) Click **Grant admin consent** if you're an admin

---

### Part 2: Configure Supabase

#### Step 1: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** > **Providers**

#### Step 2: Enable Azure Provider

1. Find **Azure** in the provider list
2. Toggle it **ON**
3. Fill in the configuration:
   - **Azure Tenant ID**: Paste your Directory (tenant) ID from Azure
   - **Azure Client ID**: Paste your Application (client) ID from Azure
   - **Azure Secret**: Paste your Client Secret from Azure
4. **Redirect URL**: This should already be filled in. Copy it if you haven't set it in Azure yet:
   ```
   https://{your-project-id}.supabase.co/auth/v1/callback
   ```
5. Click **Save**

#### Step 3: Update Azure Redirect URI (if needed)

1. Go back to Azure Portal > Your App Registration
2. Navigate to **Authentication**
3. Under **Platform configurations**, verify the Redirect URI matches Supabase
4. If not, add: `https://{your-project-id}.supabase.co/auth/v1/callback`
5. Save changes

---

### Part 3: SharePoint Video Setup

#### How SharePoint Videos Work

When a user signs in with Microsoft:
1. Their browser maintains a Microsoft session
2. SharePoint videos embedded in iframes use this session
3. If the user has access in SharePoint, they'll have access in the platform
4. No additional configuration needed!

#### Getting SharePoint Video Links

**Option 1: Direct File Link**
1. Open SharePoint
2. Navigate to your video file
3. Click the **three dots** (...) next to the video
4. Select **Details** > **Copy link**
5. Use this link in your course

**Option 2: Embed Link (Recommended)**
1. Open the video in SharePoint
2. Click **Embed**
3. Copy the embed code or URL
4. Use the URL portion in your course

**Supported SharePoint URL Formats:**
- `https://{tenant}.sharepoint.com/:v:/s/{site}/...`
- `https://{tenant}.sharepoint.com/sites/{site}/Shared%20Documents/video.mp4`
- `https://{tenant}-my.sharepoint.com/personal/...`

#### Setting SharePoint Permissions

1. **Organization-wide videos**: Store in a site all users can access
2. **Department-specific**: Use SharePoint permissions to control access
3. **Individual access**: Use OneDrive/personal SharePoint folders

---

### Part 4: Adding Videos to Courses

#### For Google Drive Videos:
1. Share video: "Anyone with the link can view"
2. Copy the link
3. Paste in course chapter video URL field

#### For SharePoint Videos:
1. Ensure users have SharePoint access via Microsoft account
2. Copy SharePoint video link
3. Paste in course chapter video URL field
4. Users must sign in with Microsoft to view

---

## Testing Your Setup

### Test Microsoft OAuth

1. Go to your platform's login page
2. Click **"Sign in with Microsoft"**
3. You should be redirected to Microsoft login
4. After signing in, you should be redirected back and logged in
5. Check that your user profile is created

### Test SharePoint Videos

1. Sign in with Microsoft account
2. Create a test course with a SharePoint video
3. Make sure the video file is accessible to your Microsoft account
4. Open the course and play the video
5. Video should load and play within the platform

### Test Google Drive Videos

1. Sign in with any account (Microsoft or regular)
2. Create a test course with a Google Drive video (publicly shared)
3. Open the course and play the video
4. Video should load and play

---

## Troubleshooting

### Microsoft Sign-In Issues

**Problem**: "Provider not enabled" error
- **Solution**: Verify Azure provider is enabled in Supabase dashboard
- Check that all credentials are correct

**Problem**: Redirect loop or 404 after Microsoft login
- **Solution**: Verify Redirect URI matches exactly in both Azure and Supabase
- Make sure you're using the correct Supabase project URL

**Problem**: Permission errors
- **Solution**: Check API permissions in Azure
- Make sure admin consent is granted (if required)

### SharePoint Video Issues

**Problem**: "Access Denied" or video won't load
- **Solution**: 
  - User must sign in with Microsoft account
  - Verify user has access to the SharePoint site
  - Check SharePoint permissions for the video file

**Problem**: Video URL not recognized
- **Solution**:
  - Try using the embed URL instead of direct link
  - Make sure URL is from SharePoint (contains "sharepoint.com")

**Problem**: Video loads but won't play
- **Solution**:
  - Check if video format is supported (MP4, MOV recommended)
  - Try opening the video directly in SharePoint to verify it works
  - Some SharePoint settings may block embedding

### Google Drive Video Issues

**Problem**: Video won't load
- **Solution**:
  - Verify sharing is set to "Anyone with the link"
  - Check that it's a video file (not a folder)
  - Try the link in an incognito window to test public access

---

## Security Considerations

### Microsoft OAuth
- **Tenant restrictions**: Use single-tenant if only your organization should access
- **Token expiration**: Supabase handles token refresh automatically
- **User data**: Only email, profile, and basic info are accessed

### SharePoint Videos
- **Access control**: SharePoint permissions apply - users need appropriate access
- **Session-based**: Uses browser's Microsoft session for authentication
- **No credentials stored**: Platform doesn't store SharePoint credentials

### Google Drive Videos
- **Public access**: Videos must be publicly accessible
- **No authentication**: Anyone with the link can view
- **Consider**: Use SharePoint for sensitive content requiring authentication

---

## Best Practices

### For Administrators

1. **Choose the right authentication**:
   - Use Microsoft OAuth for corporate/organization environments
   - Regular email/password for public platforms
   - Both can coexist

2. **Organize SharePoint content**:
   - Create a dedicated site for training videos
   - Use folders for different departments/courses
   - Set appropriate permissions per folder

3. **Video format recommendations**:
   - MP4 (H.264 codec) for best compatibility
   - Keep file sizes reasonable (compress if needed)
   - Test videos in both platforms before publishing

### For Instructors

1. **Video platform choice**:
   - SharePoint: For internal, sensitive, or permission-based content
   - Google Drive: For public or widely accessible content

2. **Always test**:
   - Preview videos after adding to course
   - Verify playback works
   - Check progress tracking

3. **Accessibility**:
   - Add clear video titles
   - Include descriptions
   - Mention any access requirements in course description

---

## Additional Resources

- [Azure AD App Registration Docs](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [SharePoint Video Embedding](https://support.microsoft.com/en-us/office/embed-a-video-in-sharepoint)

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all configuration steps were completed
3. Check browser console for error messages
4. Review Supabase logs for authentication errors
5. Test with a different browser or incognito mode

---

## Summary

Your learning platform now supports:

✅ **Microsoft OAuth** - Enterprise-grade authentication
✅ **SharePoint Videos** - Secure, permission-based video hosting
✅ **Google Drive Videos** - Public video hosting
✅ **Automatic Access Control** - Users inherit SharePoint permissions
✅ **Progress Tracking** - Works with both video sources
✅ **Edit Course Functionality** - Instructors can edit and delete courses

The system is production-ready and scalable for small-to-medium organizations!
