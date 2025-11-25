# LearnHub - LinkedIn Learning-Style Platform Architecture

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Layers](#architecture-layers)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [User Roles & Permissions](#user-roles--permissions)
7. [Features Implemented](#features-implemented)
8. [Security & Compliance](#security--compliance)
9. [Deployment & Scalability](#deployment--scalability)
10. [Development Roadmap](#development-roadmap)

---

## 🎯 System Overview

LearnHub is a comprehensive learning management platform modeled after LinkedIn Learning, designed for small to medium companies offering multi-discipline training in BIM, MEPF, Architecture, Software Development, and more.

### Core User Types

| Role | Description | Access Level |
|------|-------------|--------------|
| **Learner** | End-users taking courses | Course enrollment, progress tracking |
| **Instructor** | Content creators | Create/edit courses, view analytics |
| **Org Manager** | Company training managers | View org analytics, manage users |
| **Admin** | Platform administrators | Full system access, all management |

### Key Capabilities

- 📚 **Course Catalog** - Browse, search, and filter courses
- 🎓 **Learning Paths** - Structured skill development journeys
- 📊 **Progress Tracking** - Real-time course completion monitoring
- 🎥 **Video Lessons** - Module-based video content delivery
- 📈 **Analytics Dashboard** - Comprehensive learning metrics
- 🏆 **Certificates** - Completion certificates for learners
- 👥 **Role-Based Access** - Granular permission control

---

## 🛠 Technology Stack

### Frontend

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI framework | Latest |
| **TypeScript** | Type safety | Latest |
| **Tailwind CSS v4** | Styling | v4.0 |
| **Shadcn/ui** | Component library | Latest |
| **Lucide React** | Icon library | Latest |
| **Sonner** | Toast notifications | 2.0.3 |

### Backend

| Technology | Purpose |
|-----------|---------|
| **Supabase** | Backend platform |
| **Supabase Auth** | Authentication system |
| **Supabase Edge Functions** | Serverless API |
| **Hono** | Web framework for Edge Functions |
| **KV Store** | Key-value database |

### Infrastructure

- **Hosting**: Supabase (Edge Functions + Auth)
- **Database**: Supabase KV Store (PostgreSQL-backed)
- **Authentication**: Supabase Auth with JWT
- **File Storage**: Supabase Storage (for videos, PDFs, certificates)

---

## 🏗 Architecture Layers

### Three-Tier Architecture

```
┌─────────────────────────────────────────┐
│         FRONTEND (React + TS)            │
│  - Course catalog & detail pages         │
│  - User dashboard & progress tracking    │
│  - Admin console                         │
│  - Learning path viewer                  │
└─────────────────┬───────────────────────┘
                  │ HTTPS/REST API
┌─────────────────▼───────────────────────┐
│    SERVER (Supabase Edge Functions)      │
│  - Hono web server                       │
│  - Business logic layer                  │
│  - Authentication middleware             │
│  - API route handlers                    │
└─────────────────┬───────────────────────┘
                  │ KV Store API
┌─────────────────▼───────────────────────┐
│       DATABASE (KV Store)                │
│  - User profiles                         │
│  - Courses & modules                     │
│  - Enrollments & progress                │
│  - Learning paths                        │
│  - Analytics data                        │
└──────────────────────────────────────────┘
```

### Frontend Structure

```
/components
  /ui                    # Shadcn UI components
  Navbar.tsx            # Main navigation
  AuthPage.tsx          # Login/Signup
  HomePage.tsx          # Landing page
  CourseCatalog.tsx     # Course browsing with filters
  CourseCard.tsx        # Reusable course card
  CourseDetail.tsx      # Course detail with video player
  LearningPaths.tsx     # Learning paths listing
  MyLearning.tsx        # User dashboard
  AdminConsole.tsx      # Admin management interface

/lib
  supabase.ts           # Supabase client & API helpers
  types.ts              # TypeScript type definitions

/supabase/functions/server
  index.tsx             # Main server file with all routes
  kv_store.tsx          # Key-value store utilities (protected)
```

---

## 💾 Database Schema

### KV Store Key Patterns

The platform uses a key-value store with the following key patterns:

#### Users

**Key**: `user:{userId}`

```typescript
{
  id: string                    // Supabase Auth user ID
  email: string
  name: string
  role: 'learner' | 'instructor' | 'admin' | 'org_manager'
  organization?: string
  enrolledCourses: string[]     // Array of course IDs
  completedCourses: string[]    // Array of completed course IDs
  learningPaths: string[]       // Array of enrolled path IDs
  skills: string[]              // Acquired skills
  createdAt: string             // ISO timestamp
}
```

#### Courses

**Key**: `course:{courseId}`

```typescript
{
  id: string                    // course_{timestamp}
  title: string
  description: string
  category: string              // BIM, MEPF, Architecture, etc.
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string              // e.g., "8 hours"
  instructor: string
  instructorTitle: string
  tags: string[]
  skills: string[]              // Skills gained
  thumbnail: string             // Image URL
  modules: Module[]             // See Module schema below
  enrollmentCount: number
  rating: number                // 0-5
  reviewCount: number
  createdAt: string
  createdBy?: string            // User ID of creator
}
```

#### Modules

```typescript
{
  id: string                    // Module identifier
  title: string
  duration: string              // e.g., "45 min"
  videoUrl?: string             // Video file URL
  resources?: Resource[]        // Additional materials
}
```

#### Enrollments

**Key**: `enrollment:{userId}:{courseId}`

```typescript
{
  id: string
  userId: string
  courseId: string
  enrolledAt: string            // ISO timestamp
  progress: number              // 0-100%
  completedModules: string[]    // Array of completed module IDs
  lastAccessedAt: string        // ISO timestamp
  status: 'in_progress' | 'completed'
  completedAt?: string          // ISO timestamp
}
```

#### Learning Paths

**Key**: `path:{pathId}`

```typescript
{
  id: string                    // path_{timestamp}
  title: string
  description: string
  requiredCourses: string[]     // Course IDs that must be completed
  optionalCourses: string[]     // Optional course IDs
  estimatedDuration: string     // Total time estimate
  skills: string[]              // Skills gained
  level: string                 // Difficulty level
  enrollmentCount: number
  createdAt: string
  createdBy?: string
}
```

---

## 🔌 API Endpoints

### Base URL

```
https://{projectId}.supabase.co/functions/v1/make-server-efd95974
```

### Authentication

All protected endpoints require:
```
Authorization: Bearer {accessToken}
```

### Endpoints Reference

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Create new user account | No |

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "learner",
  "organization": "Acme Corp"
}
```

**Note**: Login is handled via Supabase Auth client-side

---

#### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/me` | Get current user profile | Yes |
| PUT | `/users/me` | Update user profile | Yes |

---

#### Courses

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/courses` | List all courses with filters | No |
| GET | `/courses/:id` | Get course details | No |
| POST | `/courses` | Create new course | Yes (Admin/Instructor) |
| PUT | `/courses/:id` | Update course | Yes (Admin/Instructor) |

**Query Parameters for GET /courses**:
- `category` - Filter by category
- `level` - Filter by difficulty level
- `search` - Text search in title/description
- `instructor` - Filter by instructor name
- `tags` - Comma-separated tags

**Example**:
```
GET /courses?category=BIM&level=Beginner&search=revit
```

---

#### Enrollments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/enrollments` | Enroll in a course | Yes |
| GET | `/enrollments/my-courses` | Get user's enrollments | Yes |
| PUT | `/enrollments/:courseId/progress` | Update course progress | Yes |

**Enroll Request**:
```json
{
  "courseId": "course_1234567890"
}
```

**Progress Update Request**:
```json
{
  "moduleId": "m1",
  "progress": 25,
  "completed": false
}
```

---

#### Learning Paths

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/learning-paths` | List all paths | No |
| GET | `/learning-paths/:id` | Get path details | No |
| POST | `/learning-paths` | Create new path | Yes (Admin) |

---

#### Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics/overview` | Platform-wide analytics | Yes (Admin/Org Manager) |
| GET | `/analytics/user-progress` | User's personal analytics | Yes |

**Analytics Response**:
```json
{
  "totalUsers": 150,
  "totalCourses": 45,
  "totalEnrollments": 892,
  "totalLearningPaths": 12,
  "activeUsers": 78,
  "completionRate": 67.5,
  "averageProgress": 54.2,
  "topCourses": [...],
  "recentEnrollments": [...]
}
```

---

#### Utility

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/seed-data` | Create sample courses/paths | Yes (Admin) |

---

## 🔐 User Roles & Permissions

### Permission Matrix

| Feature | Learner | Instructor | Org Manager | Admin |
|---------|---------|-----------|-------------|-------|
| Browse courses | ✅ | ✅ | ✅ | ✅ |
| Enroll in courses | ✅ | ✅ | ✅ | ✅ |
| Track progress | ✅ | ✅ | ✅ | ✅ |
| View personal analytics | ✅ | ✅ | ✅ | ✅ |
| Create courses | ❌ | ✅ | ❌ | ✅ |
| Edit courses | ❌ | ✅* | ❌ | ✅ |
| Create learning paths | ❌ | ❌ | ❌ | ✅ |
| View platform analytics | ❌ | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅** | ✅ |
| System configuration | ❌ | ❌ | ❌ | ✅ |

\* Instructors can only edit their own courses  
\** Org Managers can only manage users in their organization

### Role Assignment

Roles are assigned during signup and stored in:
1. Supabase Auth `user_metadata`
2. User profile in KV store

---

## ✨ Features Implemented

### 1. Course Catalog & Discovery

- **Search**: Full-text search across titles, descriptions, and instructors
- **Filters**: Category, level, instructor, tags
- **Sorting**: Popular, rating, newest, alphabetical
- **Course Cards**: Thumbnail, instructor, duration, enrollment count, rating

### 2. Course Detail & Learning

- **Video Player Interface**: Module-based video playback
- **Progress Tracking**: Per-module completion tracking
- **Course Curriculum**: Expandable module list
- **Skills Display**: Visual representation of skills gained
- **Enrollment System**: One-click enrollment

### 3. Learning Paths

- **Structured Paths**: Required and optional courses
- **Progress Tracking**: Overall path completion
- **Skill Mapping**: Skills acquired through path completion
- **Duration Estimates**: Total time commitment

### 4. User Dashboard (My Learning)

- **Enrollment Overview**: All enrolled courses
- **Progress Stats**: Completion percentages
- **Course Filtering**: In progress, completed, all
- **Quick Access**: Resume learning buttons

### 5. Analytics & Reporting

#### User Analytics
- Total enrolled courses
- Courses in progress
- Completed courses
- Average progress percentage

#### Platform Analytics (Admin)
- Total users (active vs inactive)
- Total courses and learning paths
- Total enrollments
- Platform-wide completion rate
- Average progress across all users
- Top courses by enrollment
- Recent enrollment activity

### 6. Admin Console

- **Course Management**: Create, edit courses
- **Learning Path Builder**: Create structured paths
- **Analytics Dashboard**: Platform metrics
- **User Management**: View and manage users
- **Seed Data Tool**: Quick sample data generation

### 7. Authentication & Security

- **Email/Password Auth**: Supabase authentication
- **Role-Based Access Control**: Permission enforcement
- **Session Management**: Secure JWT tokens
- **Auto-confirm Email**: For demo purposes (production should use email verification)

---

## 🔒 Security & Compliance

### Authentication

- **JWT Tokens**: Supabase Auth with secure token management
- **Session Expiry**: Automatic token refresh
- **Password Requirements**: Minimum 6 characters (configurable)

### Authorization

- **Server-Side Validation**: All protected routes validate user role
- **Resource Ownership**: Instructors can only edit own courses
- **Organization Isolation**: Org managers restricted to their org

### Data Security

- **HTTPS Only**: All API communication encrypted
- **Private Buckets**: File storage with signed URLs
- **Input Validation**: Server-side validation of all inputs
- **SQL Injection Prevention**: Parameterized queries via KV API

### GDPR Considerations

- **User Data Minimization**: Only collect necessary information
- **Data Export**: Users can export their learning data
- **Right to Deletion**: Account and data deletion capability
- **Consent Management**: Explicit consent for data processing

### Audit Logging

Currently not implemented, but recommended for production:
- User login/logout events
- Course enrollment/completion events
- Admin actions (create/edit/delete)
- Data export requests

### Rate Limiting

Recommended implementation (not currently active):
- API rate limiting per IP/user
- Failed login attempt throttling
- Enrollment rate limiting to prevent abuse

---

## 🚀 Deployment & Scalability

### Current Architecture

- **Edge Functions**: Serverless, auto-scaling
- **KV Store**: Backed by PostgreSQL for reliability
- **CDN**: Supabase CDN for global content delivery

### Scalability Considerations

#### Horizontal Scaling

The current architecture supports horizontal scaling because:
- Stateless Edge Functions (auto-scale)
- Managed database (Supabase handles scaling)
- CDN for static assets

#### Performance Optimization

**Implemented**:
- Efficient key patterns for fast lookups
- Batch operations (`mget`, `mset`) for multiple records
- Prefix-based queries for related data

**Recommended for Production**:
- Redis cache layer for frequently accessed courses
- Elasticsearch for advanced search capabilities
- Video CDN (Mux, Cloudflare Stream) for video delivery
- Image optimization and lazy loading
- Pagination for large course lists

#### Database Scaling

**Current Limitations**:
- KV store is simple but may not scale to millions of records
- No complex queries (joins, aggregations)

**Migration Path for Scale**:
1. Move to full PostgreSQL with proper schema
2. Implement database indexing
3. Add read replicas for analytics
4. Consider sharding for multi-tenant isolation

---

## 📅 Development Roadmap

### ✅ Phase 1: MVP (Current)

- [x] User authentication (signup/login)
- [x] Role-based access control
- [x] Course catalog with search/filter
- [x] Course detail pages
- [x] Enrollment system
- [x] Progress tracking
- [x] Learning paths
- [x] User dashboard
- [x] Admin console (basic)
- [x] Analytics dashboard (basic)

### 🚧 Phase 2: Enhancement (Weeks 1-4)

**Content Features**:
- [ ] Video upload and hosting integration
- [ ] PDF/resource file uploads
- [ ] Quiz and assessment system
- [ ] Certificate generation
- [ ] Course reviews and ratings

**User Features**:
- [ ] Bookmarks and notes
- [ ] Course recommendations
- [ ] Skill tracking
- [ ] Learning streaks and gamification
- [ ] Social features (comments, discussions)

**Admin Features**:
- [ ] Advanced user management
- [ ] Bulk user import (CSV)
- [ ] Learning path builder UI
- [ ] Content approval workflow
- [ ] Email notifications

### 🔮 Phase 3: Advanced Features (Weeks 5-8)

**AI/ML Integration**:
- [ ] Semantic search with vector embeddings
- [ ] AI-powered course recommendations
- [ ] Auto-generated course summaries
- [ ] Transcript-based Q&A chatbot
- [ ] Skill gap analysis

**Analytics & Reporting**:
- [ ] Advanced analytics dashboards
- [ ] Custom report builder
- [ ] Export to CSV/PDF
- [ ] Learning path analytics
- [ ] Team/organization analytics

**Enterprise Features**:
- [ ] SSO integration (SAML, OAuth)
- [ ] Multi-tenancy with org isolation
- [ ] Custom branding per organization
- [ ] API for third-party integrations
- [ ] Webhook system for events

### 🎯 Phase 4: Scale & Optimize (Weeks 9-12)

**Performance**:
- [ ] Database migration to full PostgreSQL
- [ ] Redis caching layer
- [ ] Elasticsearch for search
- [ ] CDN optimization
- [ ] Image/video optimization

**DevOps**:
- [ ] CI/CD pipeline
- [ ] Automated testing (unit, integration, e2e)
- [ ] Monitoring and alerting
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic, DataDog)

**Compliance & Security**:
- [ ] SOC 2 compliance
- [ ] GDPR full compliance
- [ ] Security audit
- [ ] Penetration testing
- [ ] Data encryption at rest

---

## 🎨 UI/UX Wireframes (Text-Based)

### Home Page

```
┌────────────────────────────────────────────────────────┐
│  [Logo] LearnHub    Home  Courses  Paths  [Search] 👤  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │  Unlock Your Potential                         │   │
│  │  Learn new skills, advance your career         │   │
│  │  [Get Started]  [Browse Courses]               │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  [Stats: 500+ Courses | 10K+ Learners | 50+ Paths]    │
│                                                        │
│  Popular Courses                         [View All →] │
│  ┌──────┐  ┌──────┐  ┌──────┐                        │
│  │Course│  │Course│  │Course│                        │
│  │ Card │  │ Card │  │ Card │                        │
│  └──────┘  └──────┘  └──────┘                        │
│                                                        │
│  Browse by Category                                   │
│  [BIM]  [MEPF]  [Architecture]  [Software Dev]        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Course Catalog

```
┌────────────────────────────────────────────────────────┐
│  Course Catalog                                        │
├────────────────────────────────────────────────────────┤
│  [Search: ____________]  [Sort: Popular ▼]  [Filters]  │
│                                                        │
│  Active Filters: [Category: BIM ×] [Level: Beginner ×]│
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Course   │  │ Course   │  │ Course   │            │
│  │ [Image]  │  │ [Image]  │  │ [Image]  │            │
│  │ Title    │  │ Title    │  │ Title    │            │
│  │ Instructor│  │ Instructor│  │ Instructor│            │
│  │ ⭐4.8 👥145│  │ ⭐4.6 👥98│  │ ⭐4.9 👥67│            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                                        │
│  [Load More]                                          │
└────────────────────────────────────────────────────────┘
```

### Course Detail

```
┌────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────┐   │
│  │  [Video Player / Preview Image]                │   │
│  │  ▶ Continue Learning                           │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  ┌─────────────────────┐  ┌────────────────────────┐  │
│  │ Course Title        │  │ Your Progress: 45%     │  │
│  │ Category | Level    │  │ ██████░░░░░░░░░        │  │
│  │ ⭐4.8 (52) 👥145 ⏱8h│  │ [Continue Learning]    │  │
│  │                     │  │                        │  │
│  │ Instructor Name     │  │ ⏱ 8 hours              │  │
│  │ Senior BIM Manager  │  │ 👥 145 enrolled        │  │
│  │                     │  └────────────────────────┘  │
│  │ [Overview] [Curriculum] [Instructor]              │
│  │                                                   │
│  │ What you'll learn:                                │
│  │ ✓ 3D Modeling                                    │
│  │ ✓ BIM Coordination                               │
│  │ ✓ Documentation                                  │
│  │                                                   │
│  │ Course Curriculum:                                │
│  │ ✓ 1. Introduction (45 min)                       │
│  │ ▶ 2. Creating Walls (60 min)                     │
│  │ 🔒 3. Doors & Windows (50 min)                    │
│  └─────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### My Learning Dashboard

```
┌────────────────────────────────────────────────────────┐
│  My Learning                                           │
├────────────────────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐              │
│  │ 📚 5 │  │ ⏱ 3  │  │ ✓ 2  │  │ 📈65%│              │
│  │Enroll│  │In Pr.│  │Compl.│  │ Avg  │              │
│  └──────┘  └──────┘  └──────┘  └──────┘              │
│                                                        │
│  [In Progress] [Completed] [All Courses]               │
│                                                        │
│  ┌──────────────────────────────────────┐             │
│  │ Revit Fundamentals         Progress  │             │
│  │ [Image] BIM | Beginner     ██████░░ 65%│             │
│  │ Last accessed: 2 hours ago [Continue]│             │
│  └──────────────────────────────────────┘             │
│                                                        │
│  ┌──────────────────────────────────────┐             │
│  │ MEP Coordination           Progress  │             │
│  │ [Image] MEPF | Intermediate ███░░░░ 30%│             │
│  │ Last accessed: 1 day ago   [Continue]│             │
│  └──────────────────────────────────────┘             │
└────────────────────────────────────────────────────────┘
```

### Admin Console

```
┌────────────────────────────────────────────────────────┐
│  Admin Console                      [+ Create Course]  │
├────────────────────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐              │
│  │👥150 │  │📚 45 │  │📊892 │  │📈54%│              │
│  │Users │  │Course│  │Enroll│  │Avg P│              │
│  └──────┘  └──────┘  └──────┘  └──────┘              │
│                                                        │
│  [Courses] [Users] [Analytics] [Learning Paths]        │
│                                                        │
│  Top Courses by Enrollment:                           │
│  ┌──────────────────────────────────────────────┐     │
│  │ Revit Fundamentals         BIM | Beginner    │     │
│  │ 145 enrolled | 4.8⭐                          │     │
│  │ [Edit] [View Analytics]                      │     │
│  └──────────────────────────────────────────────┘     │
│                                                        │
│  ┌──────────────────────────────────────────────┐     │
│  │ MEP Coordination          MEPF | Intermediate │     │
│  │ 98 enrolled | 4.6⭐                           │     │
│  │ [Edit] [View Analytics]                      │     │
│  └──────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────┘
```

---

## 🔧 Technical Implementation Notes

### Frontend Best Practices

1. **Component Reusability**: CourseCard, Progress bars, Badges
2. **State Management**: React hooks (useState, useEffect)
3. **Type Safety**: Full TypeScript coverage
4. **Responsive Design**: Mobile-first with Tailwind
5. **Accessibility**: Semantic HTML, ARIA labels

### Backend Best Practices

1. **Route Organization**: Logical grouping by resource
2. **Error Handling**: Comprehensive try-catch with logging
3. **Validation**: Input validation on all endpoints
4. **Middleware**: CORS, logging, authentication
5. **Consistency**: Standard response format

### API Response Format

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}

// Error
{
  "success": false,
  "error": "Error message"
}
```

---

## 📊 Sample Data Model Example

### Complete Course Object

```json
{
  "id": "course_revit_basics",
  "title": "Revit Fundamentals for Architects",
  "description": "Master the basics of Autodesk Revit for architectural design and BIM workflows.",
  "category": "BIM",
  "level": "Beginner",
  "duration": "8 hours",
  "instructor": "Sarah Johnson",
  "instructorTitle": "Senior BIM Manager",
  "tags": ["Revit", "BIM", "Architecture"],
  "skills": ["3D Modeling", "BIM Coordination", "Documentation"],
  "thumbnail": "https://images.unsplash.com/...",
  "modules": [
    {
      "id": "m1",
      "title": "Introduction to Revit Interface",
      "duration": "45 min",
      "videoUrl": ""
    },
    {
      "id": "m2",
      "title": "Creating Walls and Floors",
      "duration": "60 min",
      "videoUrl": ""
    }
  ],
  "enrollmentCount": 145,
  "rating": 4.8,
  "reviewCount": 52,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

---

## 🎓 Getting Started

### For Administrators

1. **Sign up** with role "admin"
2. Click "Seed Sample Data" in Admin Console
3. Explore the pre-populated courses and learning paths

### For Learners

1. **Sign up** with role "learner"
2. Browse the **Course Catalog**
3. **Enroll** in courses that interest you
4. Track your **progress** in "My Learning"

### For Instructors

1. **Sign up** with role "instructor"
2. Navigate to **Admin Console**
3. **Create courses** with the course builder
4. View **analytics** on your courses

---

## 📝 Notes

- This is a **prototype/demo platform** - not production-ready
- Email confirmation is auto-enabled (no SMTP configured)
- Video playback is **simulated** (integrate with Mux/Vimeo for real videos)
- File uploads are **not implemented** (use Supabase Storage in production)
- Search is **basic text matching** (use Elasticsearch for advanced search)

---

## 🤝 Support & Contact

For questions or issues with this architecture:
- Review the inline code comments
- Check the API endpoint documentation
- Test with the seed data feature

---

**Document Version**: 1.0  
**Last Updated**: November 2024  
**Architecture Status**: MVP Complete
