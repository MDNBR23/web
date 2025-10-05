# NBR WEB - Medical Platform

## Overview
NBR WEB is a Spanish-language medical web platform designed for pediatric and neonatal healthcare professionals. It provides a comprehensive system for user management, medical announcements, clinical guidelines, and medication information.

**Current Status:** Fully functional and ready for use. The application is running on Replit with a Node.js HTTP server serving static files.

## Project Architecture

### Technology Stack
- **Frontend:** Pure HTML5, CSS3, and vanilla JavaScript
- **Data Storage:** Browser localStorage (client-side only, no backend database)
- **Server:** Node.js HTTP server for static file serving
- **Port:** 5000 (configured for Replit environment)

### File Structure
```
.
├── index.html          - Login page (entry point)
├── register.html       - User registration page
├── main.html          - Main dashboard (announcements & guides)
├── calculadora.html   - Medicine database/calculator
├── admin.html         - Admin panel for user/content management
├── configuracion.html - User profile settings
├── script.js          - All application JavaScript logic
├── style.css          - All styling and themes
├── server.js          - HTTP server for production
└── replit.md          - This documentation
```

### Key Features
1. **Authentication System**
   - User login with username/password
   - Registration with admin approval workflow
   - Pre-seeded admin account (username: `admin`, password: `1234`)
   - Role-based access (admin/user)

2. **User Management** (Admin only)
   - Approve/reject new user registrations
   - Edit user profiles and roles
   - Manage user status (approved/pending)

3. **Content Management**
   - Announcements with images
   - Medical guides with URLs
   - All content stored in localStorage

4. **User Features**
   - Profile customization with avatar upload
   - Theme switcher (light/dark mode)
   - Medicine database access
   - View announcements and clinical guides

### Data Storage
All data is stored in browser localStorage:
- `nbr_users` - User accounts
- `nbr_auth` - Current session
- `nbr_anuncios` - Announcements
- `nbr_guias` - Clinical guides
- `theme` - User theme preference
- `sidebarCollapsed` - UI preference

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
- No build step required (static files)

### Default Admin Access
- Username: `admin`
- Password: `1234`
- **Important:** Change the admin password after first login

## Recent Changes
- **2025-10-05:** Mejoras completas de funcionalidad
  - Implementado banco de medicamentos completo con 16 medicamentos pediátricos/neonatales
  - Agregada funcionalidad de búsqueda en tiempo real para medicamentos
  - Panel de administración de medicamentos (crear, editar, eliminar)
  - Mejorados estilos CSS con utilidades adicionales
  - Usuario administrador funcional (admin/1234)
  - Todas las secciones operativas: anuncios, guías, usuarios, medicamentos

- **2025-10-05:** Initial Replit setup
  - Installed Node.js 20
  - Created HTTP server with proper cache-control headers
  - Configured workflow to run on port 5000
  - Set up deployment configuration
  - Added .gitignore for Node.js

## User Preferences
None recorded yet.

## Notes
- This is a client-side application - all data is stored in the browser
- Users must be approved by admin before they can log in
- Data persists per browser/device via localStorage
- No backend API or database required
- Perfect for small medical teams or institutions
