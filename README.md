# Only1 Task - Account Permission Management System
> Developed by Yasindu Nethmina

A modern React application for managing user account permissions.

## 📦 Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## 📸 Screenshots

<h3 align="center">Authentication</h3>

![Login Page](/public/login.png)

![Signup Page](/public/signup.png)

<h3 align="center">Invitation Management</h3>

![Send Invitation](/public/send-invitation.png)

![Edit Invitation](/public/edit-invitation.png)

![Cancel Invitation](/public/cancel-invitation.png)

<h3 align="center">Dashboard Views</h3>

![Invitations Given](/public/invitations-given.png)

![Invitations Received](/public/invitations-received.png)

## 🚀 Key Features

### Authentication & Security
- **Secure Authentication System**
  - Comprehensive signup/login flow
  - Session management using local JSON database (for demo purposes)
  - Protected route system for `/dashboard` with automatic redirection to `/signup`
  - Secure logout functionality with complete session clearing

### Invitation Management
- **Invitation Creation & Control**
  - Intuitive modal-based invitation system with user selection
  - Granular permission controls via switch components
  - Configurable invitation expiration dates by selecting amount of days
  - Hierarchical permission system (write permissions automatically include read access)

- **Invitation Processing**
  - Accept/reject incoming invitations
  - Edit pending invitations through a dedicated modal interface
  - Invitation deletion with confirmation modal
  - Synchronized status updates across all tables (Given, Recieved)

### User Interface
- **Advanced Table Systems**
  - Smooth infinite scrolling implemented with custom hooks and TanStack Query's queries (infinite queries)
  - Responsive loading states with visual spinners for both initial load and infinite scroll features
  - Fully mobile-responsive design
  - Accessible features implemented, focusing on keyboard-navigable tables with ARIA support

- **Form Management**
  - Robust form validation
  - Comprehensive error handling with Sonner toast notifications

## 🛠️ Technology Stack

### Core Technologies
- TypeScript
- React 19
- TanStack Router
- TanStack Query
- React Aria Components

### Form & Validation
- React Hook Form
- Zod Schema Validation

### UI & Styling
- Tailwind CSS
- React Aria Components Tailwind CSS

## 💻 Implementation Details

### Permission Management
- **Hierarchical Permissions**
  - Read/Write Posts
  - Read/Write Messages
  - Read/Write Profile
  - Automatic read permission with write access

### Data Persistence
- Local JSON database server for demo purposes
- Real-time synchronization between tables on updates
- Robust session management

## 🎯 Accessibility Features

- Proper ARIA roles and labels
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Semantic HTML structure

## 📱 Responsive Design

- Fluid layouts from mobile to desktop
- Breakpoint optimization (sm to 2xl)
- Proper text truncation handling
- Consistent UI across devices

## 🔍 Future Improvements

1. **Enhanced Features**
   - Batch invitation management
   - Real-time notifications

2. **Technical Enhancements**
   - Migration to PostgreSQL with Kysely
   - Advanced caching strategies
   - Optimistic updates

## 🤝 Notes on React Aria Implementation

The project utilizes React Aria Components extensively, particularly for tables and form elements, with opportunities for further enhancement:

- Deeper integration with React Aria hooks
- Enhanced usage of Group and Toolbar components
- Additional accessibility improvements

*Note: As React Aria was new to my technology stack, I focused on delivering core functionality while maintaining accessibility standards. Given the two-day time constraint, I prioritized building a robust, working solution that follows best practices. I'm looking forward to exploring more of React Aria's components and hooks capabilities in future projects.*

For questions or feedback, please reach out to contact@yasindu.me