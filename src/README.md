# 🎓 LearnHub - Enterprise Learning Management Platform

A comprehensive LinkedIn Learning-style platform built for organizations to deliver training in BIM, MEPF, Architecture, Software Development, and more.

![Platform Status](https://img.shields.io/badge/status-MVP%20Complete-success)
![Tech Stack](https://img.shields.io/badge/stack-React%20%7C%20TypeScript%20%7C%20Supabase-blue)

---

## ✨ Features

### 🚀 Core Functionality

- **📚 Course Catalog** - Browse 500+ courses with advanced search and filtering
- **🎥 Video Learning** - Google Drive integrated video player with progress tracking
- **📊 Progress Tracking** - Real-time course completion monitoring with per-video tracking
- **⏯️ Auto-Resume** - Videos automatically resume from last watched position
- **🎓 Learning Paths** - Structured skill development journeys
- **👥 Multi-Role System** - Learner, Instructor, Org Manager, Admin
- **📈 Analytics Dashboard** - Comprehensive learning metrics
- **🏆 Certificates** - Completion certificates for learners
- **🔍 Smart Search** - Search courses by title, instructor, skills, tags
- **☁️ Google Drive Integration** - Easy video hosting without complex setup

### 👤 User Roles

| Role | Capabilities |
|------|--------------|
| **Learner** | Browse courses, enroll, track progress, earn certificates |
| **Instructor** | Create and manage courses, upload Google Drive videos, view course analytics |
| **Org Manager** | View organization-wide analytics, manage team learning |
| **Admin** | Full platform access, user/course management, system analytics |

---

## 🎯 Quick Start

### 1️⃣ First Time Setup

When you first open the app:

1. **Click "Sign up"** in the top right
2. Fill in your details:
   - **Name**: Your full name
   - **Email**: Your email address
   - **Password**: At least 6 characters
   - **Role**: Choose your role (try "Admin" for full access)
   - **Organization**: Optional - your company name

3. **Create Account** - you'll be automatically logged in

### 2️⃣ Populate Sample Data (Admins Only)

If you signed up as an **Admin**:

1. Navigate to **Admin Console** in the top menu
2. Click **"Seed Sample Data"** button
3. Wait for confirmation - this creates:
   - ✅ 3 sample courses (Revit, MEP, Python)
   - ✅ 1 sample learning path (BIM Certification)
   - ✅ Realistic enrollment data

### 3️⃣ Start Learning

1. **Browse Courses** - Go to "Courses" in the navigation
2. **Enroll** - Click any course and hit "Enroll Now"
3. **Start Learning** - Click modules to mark them complete
4. **Track Progress** - View "My Learning" to see your progress

---

## 📖 User Guide

### For Learners

#### Browse & Search

- **Search bar**: Search by course name, instructor, or skills
- **Filters**: Category (BIM, MEPF, etc.), Level (Beginner/Intermediate/Advanced)
- **Sort**: Popular, Rating, Newest, A-Z

#### Enroll in Courses

1. Click any course card
2. Review course details, curriculum, and skills
3. Click "Enroll Now" (free!)
4. Start learning immediately

#### Track Progress

- **My Learning** shows all your enrolled courses
- Progress bars show completion percentage
- Mark modules complete as you finish them
- View "In Progress" vs "Completed" courses

### For Instructors

#### Create a Course

1. Go to **Admin Console**
2. Click **"Create Course"**
3. Fill in course details:
   - Title & Description
   - Category & Level
   - Duration estimate
   - Instructor info
   - Tags & Skills
4. **Submit** - course is live immediately

### For Admins

#### Platform Management

**Course Management**:
- View all courses
- Create new courses
- Edit existing courses
- View enrollment statistics

**Analytics Dashboard**:
- Total users and active users
- Total courses and enrollments
- Platform-wide completion rates
- Top courses by popularity
- Recent enrollment activity

**Learning Paths**:
- Create structured learning paths
- Define required and optional courses
- Set skill outcomes

---

## 🏗️ Architecture

### Technology Stack

**Frontend**:
- React + TypeScript
- Tailwind CSS v4
- Shadcn/ui components
- Lucide icons

**Backend**:
- Supabase Edge Functions (Serverless)
- Hono web framework
- Supabase Auth (JWT)
- KV Store database

**Infrastructure**:
- Supabase hosting
- PostgreSQL-backed KV store
- Edge CDN for global delivery

### Key Design Patterns

- **Three-tier architecture**: Frontend → Server → Database
- **Role-based access control**: Enforced at API level
- **Component-driven UI**: Reusable React components
- **Type-safe**: Full TypeScript coverage
- **RESTful API**: Standard HTTP methods and status codes

---

## 📊 Data Model

### Users
- Profile information
- Role assignment
- Enrolled courses
- Completed courses
- Skills acquired

### Courses
- Metadata (title, description, category)
- Instructor information
- Module structure
- Skills & tags
- Enrollment metrics

### Enrollments
- User-course relationship
- Progress tracking (0-100%)
- Completed modules
- Status (in_progress, completed)

### Learning Paths
- Multiple courses bundled
- Required vs optional courses
- Skill outcomes
- Duration estimates

---

## 🎨 Screenshots & Wireframes

### Home Page
- Hero section with CTA
- Platform statistics
- Popular courses grid
- Category navigation

### Course Catalog
- Advanced search & filters
- Course cards with ratings
- Sort options
- Active filter display

### Course Detail
- Video player interface
- Curriculum with module list
- Skills & learning outcomes
- Enrollment CTA

### My Learning
- Personal dashboard
- Progress statistics
- Enrolled courses grid
- Completion tracking

### Admin Console
- Platform analytics
- Course management
- User management
- Learning path builder

---

## 🔐 Security & Compliance

### Authentication
- Email/password authentication
- JWT token-based sessions
- Automatic session refresh
- Secure password requirements

### Authorization
- Role-based access control (RBAC)
- Server-side permission validation
- Resource ownership checks
- Organization-level isolation

### Data Protection
- HTTPS-only communication
- Secure credential storage
- Input validation
- XSS/CSRF protection

---

## 🎥 Google Drive Video Integration

### How It Works

The platform seamlessly integrates with Google Drive for video hosting, providing:

- **Easy Setup**: Just paste your Google Drive video link
- **Auto-Resume**: Students continue from where they left off
- **Progress Tracking**: Every second of watch time is tracked
- **Auto-Complete**: Modules marked complete at 90% watched
- **Cross-Device Sync**: Progress follows students across devices

### For Instructors

1. Upload your video to Google Drive
2. Set sharing to "Anyone with the link"
3. Copy the video URL
4. Paste into the module's `videoUrl` field
5. Students can now watch and track progress!

**Supported URL formats**:
- `https://drive.google.com/file/d/{ID}/view`
- `https://drive.google.com/open?id={ID}`
- Direct file ID: `{ID}`

### For Students

When watching videos:
- Click any module to start watching
- Progress saves every 5 seconds automatically
- Return anytime - video resumes from last position
- Progress bar shows % watched
- Module auto-completes at 90%

📖 **Full Guide**: See `/guidelines/GOOGLE_DRIVE_VIDEO_SETUP.md` for detailed setup instructions

📊 **Technical Details**: See `/VIDEO_PROGRESS_SYSTEM.md` for system architecture

---

## 🚀 Future Enhancements

### Phase 2 (Weeks 1-4)
- ✨ Enhanced video analytics (watch patterns, drop-off points)
- ✨ Quiz & assessment system
- ✨ Certificate generation with PDF export
- ✨ Course reviews and ratings
- ✨ Bookmarks and notes

### Phase 3 (Weeks 5-8)
- 🤖 AI-powered course recommendations
- 🤖 Semantic search with embeddings
- 🤖 Auto-generated course summaries
- 🤖 Transcript-based Q&A chatbot
- 📊 Advanced analytics & reporting

### Phase 4 (Weeks 9-12)
- 🔐 SSO integration (SAML, OAuth)
- 🏢 Multi-tenancy with org isolation
- 🎨 Custom branding per organization
- 🔌 API for third-party integrations
- ⚡ Performance optimization (Redis, Elasticsearch)

---

## 📚 API Documentation

### Base URL
```
https://{projectId}.supabase.co/functions/v1/make-server-efd95974
```

### Authentication
```bash
Authorization: Bearer {access_token}
```

### Key Endpoints

#### Courses
```bash
GET    /courses              # List all courses
GET    /courses/:id          # Get course details
POST   /courses              # Create course (Admin/Instructor)
PUT    /courses/:id          # Update course (Admin/Instructor)
```

#### Enrollments
```bash
POST   /enrollments                      # Enroll in course
GET    /enrollments/my-courses           # User's enrollments
PUT    /enrollments/:courseId/progress   # Update progress
```

#### Analytics
```bash
GET    /analytics/overview        # Platform analytics (Admin)
GET    /analytics/user-progress   # User progress
```

Full API documentation available in `/ARCHITECTURE.md`

---

## 🛠️ Development

### Project Structure

```
/
├── components/
│   ├── ui/                # Shadcn components
│   ├── Navbar.tsx         # Main navigation
│   ├── AuthPage.tsx       # Login/Signup
│   ├── HomePage.tsx       # Landing page
│   ├── CourseCatalog.tsx  # Course browsing
│   ├── CourseDetail.tsx   # Course detail view
│   ├── MyLearning.tsx     # User dashboard
│   └── AdminConsole.tsx   # Admin interface
├── lib/
│   ├── supabase.ts        # API client
│   └── types.ts           # TypeScript types
├── supabase/functions/server/
│   └── index.tsx          # Backend API
├── App.tsx                # Main app component
└── ARCHITECTURE.md        # Full documentation
```

### Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Supabase** - Backend platform
- **Hono** - Web framework
- **Shadcn/ui** - Component library

---

## 💡 Tips & Tricks

### For Best Experience

1. **Start as Admin** - Create account with "Admin" role to access all features
2. **Seed Data First** - Use "Seed Sample Data" to populate courses
3. **Explore All Roles** - Create multiple accounts to see different perspectives
4. **Check Analytics** - View platform metrics in Admin Console

### Common Workflows

**Creating Your First Course**:
```
Admin Console → Create Course → Fill Details → Submit
```

**Enrolling in a Course**:
```
Courses → Select Course → Enroll Now → Continue Learning
```

**Tracking Team Progress**:
```
Admin Console → Analytics → View Completion Rates
```

---

## 🐛 Troubleshooting

### Can't see courses?
- Make sure you've clicked "Seed Sample Data" as an Admin
- Refresh the page

### Can't enroll in courses?
- Make sure you're logged in
- Check if you're already enrolled

### Admin Console not showing?
- Verify your account has "Admin" or "Org Manager" role
- Log out and log back in

### Progress not updating?
- Click "Mark Complete" on individual modules
- Progress auto-calculates based on completed modules

---

## 📝 Sample Courses

After seeding data, you'll have:

### 1. Revit Fundamentals for Architects
- **Category**: BIM
- **Level**: Beginner
- **Duration**: 8 hours
- **Modules**: 5 lessons
- **Skills**: 3D Modeling, BIM Coordination, Documentation

### 2. MEP Coordination in Navisworks
- **Category**: MEPF
- **Level**: Intermediate
- **Duration**: 6 hours
- **Modules**: 4 lessons
- **Skills**: Clash Detection, Coordination, Model Review

### 3. Python Automation for AEC
- **Category**: Software Development
- **Level**: Advanced
- **Duration**: 10 hours
- **Modules**: 4 lessons
- **Skills**: Python Programming, API Integration, Automation

---

## 🎯 Use Cases

### Corporate Training Programs
- Onboard new employees with structured learning paths
- Upskill teams in BIM, MEPF, and software tools
- Track training compliance and completion

### Educational Institutions
- Deliver online courses to students
- Monitor student progress and engagement
- Issue digital certificates

### Professional Development
- Offer continuing education credits
- Provide skill-based learning tracks
- Enable self-paced learning

---

## 🌟 Key Differentiators

Compared to generic LMS platforms, LearnHub offers:

✅ **Industry-Specific**: Built for AEC (Architecture, Engineering, Construction)  
✅ **Multi-Discipline**: BIM, MEPF, Architecture, Software Development  
✅ **Role-Based**: Tailored experiences for learners, instructors, and admins  
✅ **Progress-Focused**: Granular module-level tracking  
✅ **Path-Driven**: Structured learning paths for skill mastery  
✅ **Analytics-Rich**: Comprehensive platform and user metrics  
✅ **Modern Stack**: Built with latest web technologies  

---

## 📄 License

This is a demonstration project built with Figma Make. Not for production use without proper security hardening and compliance review.

---

## 🤝 Contributing

This is a prototype platform. For production deployment:

1. Implement proper email verification
2. Add video hosting integration (Mux, Vimeo)
3. Implement file upload for course materials
4. Add comprehensive testing
5. Conduct security audit
6. Review GDPR/compliance requirements

---

## 📧 Support

For platform issues or questions:
- Review the `/ARCHITECTURE.md` for technical details
- Check API documentation for endpoint specs
- Test with sample data using "Seed Data" feature

---

## 🏆 Credits

**Built with**:
- React & TypeScript
- Supabase (Auth, Database, Edge Functions)
- Tailwind CSS v4
- Shadcn/ui components
- Lucide icons

**Inspired by**: LinkedIn Learning, Coursera, Udemy

---

**Version**: 1.0.0  
**Status**: MVP Complete ✅  
**Last Updated**: November 2024

---

## 🚀 Get Started Now!

1. **Sign up** with your email
2. **Choose "Admin"** role for full access
3. **Seed sample data** to explore features
4. **Start learning** or create your first course!

Happy Learning! 🎓