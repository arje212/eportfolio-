# API Contracts & Integration Plan

## Overview
This document outlines the backend API endpoints, data models, and frontend-backend integration for the Computer Engineering Portfolio.

## Database Models

### 1. Profile Collection
```javascript
{
  _id: ObjectId,
  name: String,
  title: String,
  tagline: String,
  bio: String,
  email: String,
  phone: String,
  location: String,
  profileImage: String (URL),
  resumeUrl: String (URL),
  updatedAt: DateTime
}
```

### 2. Skills Collection
```javascript
{
  _id: ObjectId,
  category: String,
  items: [String],
  order: Number,
  createdAt: DateTime
}
```

### 3. Education Collection
```javascript
{
  _id: ObjectId,
  degree: String,
  institution: String,
  year: String,
  description: String,
  order: Number,
  createdAt: DateTime
}
```

### 4. Certificates Collection
```javascript
{
  _id: ObjectId,
  title: String,
  issuer: String,
  date: String,
  image: String (URL),
  order: Number,
  createdAt: DateTime
}
```

### 5. Projects Collection
```javascript
{
  _id: ObjectId,
  title: String,
  category: String,
  description: String,
  software: String,
  year: String,
  image: String (URL),
  specs: [String],
  order: Number,
  createdAt: DateTime
}
```

### 6. Contact Messages Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: DateTime,
  isRead: Boolean
}
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login (password validation)
- `POST /api/auth/verify` - Verify authentication token

### Profile
- `GET /api/profile` - Get profile data
- `PUT /api/profile` - Update profile (protected)

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill category (protected)
- `PUT /api/skills/:id` - Update skill category (protected)
- `DELETE /api/skills/:id` - Delete skill category (protected)

### Education
- `GET /api/education` - Get all education entries
- `POST /api/education` - Create education entry (protected)
- `PUT /api/education/:id` - Update education entry (protected)
- `DELETE /api/education/:id` - Delete education entry (protected)

### Certificates
- `GET /api/certificates` - Get all certificates
- `POST /api/certificates` - Create certificate (protected)
- `PUT /api/certificates/:id` - Update certificate (protected)
- `DELETE /api/certificates/:id` - Delete certificate (protected)

### Projects
- `GET /api/projects` - Get all projects (with optional category filter)
- `GET /api/projects/:id` - Get single project details
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (protected)

### Upload
- `POST /api/upload/image` - Upload image (protected)

## Mock Data to Replace

Current mock data in `/app/frontend/src/data/mock.js`:
- `profileData` → API call to `/api/profile`
- `skills` → API call to `/api/skills`
- `education` → API call to `/api/education`
- `certificates` → API call to `/api/certificates`
- `projects` → API call to `/api/projects`

## Frontend Integration Steps

1. **Create API Service** (`/app/frontend/src/services/api.js`)
   - Axios instance with base URL
   - Auth token interceptor
   - Error handling

2. **Update Pages to Use API**
   - Home.js: Fetch profile, skills, certificates, projects
   - Projects.js: Fetch projects with filtering
   - ProjectDetail.js: Fetch single project by ID
   - Certificates.js: Fetch certificates
   - Login.js: Call login API, store JWT token
   - Admin.js: CRUD operations for all data

3. **Authentication Flow**
   - Login submits password → Backend validates → Returns JWT
   - Store JWT in localStorage
   - Include JWT in Authorization header for protected routes
   - Admin page checks authentication on mount

4. **Image Upload Implementation**
   - Use FormData for file uploads
   - Upload endpoint returns image URL
   - Update profile/certificate/project with new image URL

## Backend Implementation Notes

- Use JWT for authentication
- Password: `Bhudzray91` (hashed with bcrypt)
- Protected routes use authentication middleware
- Image uploads stored in `/app/backend/uploads/` directory
- Serve uploads as static files
- CORS enabled for frontend communication

## Error Handling

Frontend should handle:
- Network errors
- 401 Unauthorized (redirect to login)
- 404 Not Found
- 500 Server errors
- Validation errors (400)

Backend returns:
```javascript
{
  success: boolean,
  data: any,
  error: string (if error)
}
```
