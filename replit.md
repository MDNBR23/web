# NBR WEB - Medical Platform

## Overview
NBR WEB is a Spanish-language medical web platform designed for pediatric and neonatal healthcare professionals. It provides a comprehensive system for user management, medical announcements, clinical guidelines, and medication information.

**Current Status:** Fully functional and production-ready. The application now uses a complete backend API with proper user session management and data isolation.

## Project Architecture

### Technology Stack
- **Frontend:** Pure HTML5, CSS3, and vanilla JavaScript
- **Backend:** Node.js + Express with REST API
- **Data Storage:** File-based JSON storage with user isolation
- **Authentication:** Session-based auth with bcrypt password hashing
- **Server:** Express HTTP server on port 5000 (Replit-optimized)

### File Structure
```
.
├── index.html          - Login page (entry point)
├── register.html       - User registration page
├── reset-password.html - Password reset page
├── main.html          - Main dashboard (announcements & guides)
├── calculadora.html   - Medicine database/calculator
├── admin.html         - Admin panel for user/content management
├── configuracion.html - User profile settings
├── script.js          - All application JavaScript logic (API-based)
├── style.css          - All styling and themes
├── server.js          - Express server with REST API
├── data/              - User data storage (JSON files, gitignored)
└── replit.md          - This documentation
```

### Key Features

#### 1. Authentication System
- Session-based authentication with express-session
- Secure password hashing using bcrypt
- Password reset functionality with secure tokens
- Pre-seeded admin account (username: `admin`, password: `1234`)
- Role-based access control (admin/user)

#### 2. User Management (Admin only)
- Approve/reject new user registrations
- Edit user profiles and roles
- Manage user status (approved/pending/rejected/suspended)
- View all users in the system

#### 3. Data Isolation
- **Users:** Each user has private data stored separately
- **Anuncios (Announcements):**
  - Global announcements visible to all users
  - Personal announcements visible only to creator
  - Admin can create/edit/delete global and all announcements
  - Users can create/edit/delete their own announcements
- **Guías (Guides):**
  - Global guides visible to all users
  - Personal guides visible only to creator
  - Admin can create/edit/delete global and all guides
  - Users can create/edit/delete their own guides
- **Medications:** Shared database accessible to all authenticated users, admin-only editing

#### 4. User Features
- Profile customization with avatar upload (base64 encoded)
- Theme switcher (light/dark mode)
- Medicine database with real-time search
- View announcements and clinical guides
- Password reset via email verification

### Data Storage
All data is stored in server-side JSON files:
- `data/users.json` - User accounts with hashed passwords
- `data/anuncios_global.json` - Global announcements
- `data/anuncios_[username].json` - User-specific announcements
- `data/guias_global.json` - Global guides
- `data/guias_[username].json` - User-specific guides
- `data/medications.json` - Shared medication database

### API Endpoints

#### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/session` - Check session status
- `POST /api/reset-password-request` - Request password reset token
- `POST /api/reset-password` - Reset password with token

#### User Management
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:username` - Update user (admin only)
- `DELETE /api/users/:username` - Delete user (admin only)
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update current user profile

#### Content
- `GET /api/anuncios` - Get announcements (global + user's own)
- `POST /api/anuncios` - Create/update announcement
- `DELETE /api/anuncios/:id` - Delete announcement
- `GET /api/guias` - Get guides (global + user's own)
- `POST /api/guias` - Create/update guide
- `DELETE /api/guias/:id` - Delete guide
- `GET /api/medications` - Get all medications
- `POST /api/medications` - Create/update medication (admin only)
- `DELETE /api/medications/:id` - Delete medication (admin only)

## Development

### Running Locally
The server is automatically started via the configured workflow:
```bash
node server.js
```

The application will be available at `http://0.0.0.0:5000/`

### Deployment
Configured for Replit's autoscale deployment:
- Deployment type: Autoscale (stateless web app)
- Run command: `node server.js`
- No build step required

### Default Admin Access
- Username: `admin`
- Password: `1234`
- **Important:** Change the admin password after first login via the configuration page

## UI/UX Improvements

### Design Enhancements
1. **Typography:** Enhanced contrast with darker text colors, text shadows, and bolder fonts
2. **Page Transitions:** Smooth transitions without white flash using optimized CSS animations
3. **Sidebar:** Icons and NBR WEB title remain visible even when collapsed
4. **Toggle Button:** Modern circular button with dynamic icon (☰/→)
5. **Background:** Full-page gradient with fixed attachment for consistent appearance
6. **Theme Support:** Light and dark themes with proper contrast ratios

### Performance
- Optimized CSS transitions with cubic-bezier easing
- No-cache headers for immediate content updates
- Efficient session management
- Fast API responses with file-based storage

## Recent Changes

### 2025-10-05: Major Backend & UX Overhaul
- **Backend API Implementation:**
  - Migrated from localStorage to Express-based REST API
  - Implemented session-based authentication with bcrypt
  - Added file-based JSON storage with user data isolation
  - Created complete CRUD endpoints for all resources
  
- **Security Enhancements:**
  - Password hashing with bcrypt (10 rounds)
  - Secure session management with express-session
  - Password reset functionality with time-limited tokens
  - API authentication middleware
  
- **User Data Isolation:**
  - Each user has separate data files for anuncios and guías
  - Global content system where admin can share with all users
  - Admin can view and manage all user data
  - Regular users only see global + their own content
  
- **UI/UX Improvements:**
  - Enhanced typography contrast and readability
  - Smooth page transitions without white flash
  - Modern circular sidebar toggle button
  - Sidebar shows icons/title when collapsed
  - Background extends to full page height
  - Improved glassmorphic design with better backdrop filters

- **New Features:**
  - Password reset page with secure token system
  - Link on login page for forgotten passwords
  - Admin checkboxes to mark content as global/personal
  - Real-time session validation
  - Better error handling and user feedback

### 2025-10-05: Initial Replit Setup
- Installed Node.js 20
- Created basic HTTP server with cache-control headers
- Configured workflow to run on port 5000
- Set up deployment configuration
- Added .gitignore for Node.js

## Security Notes
- All passwords are hashed with bcrypt before storage
- Sessions are server-side with httpOnly cookies
- Password reset tokens expire after 1 hour
- API endpoints validate authentication for protected routes
- Admin-only endpoints check role before allowing access
- Data files are excluded from git via .gitignore

## User Preferences
None recorded yet.

## Notes
- Data persists in server-side JSON files
- Users must be approved by admin before they can log in
- Each user has their own isolated data storage
- Admin can view and manage all content
- Perfect for small to medium medical teams or institutions
- Scalable to PostgreSQL database if needed in the future
