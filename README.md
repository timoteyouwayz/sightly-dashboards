# Kenya Youth For Christ (KYFC) Management System

A comprehensive internal management system for Kenya Youth For Christ organization, built with React, TypeScript, and Tailwind CSS.

## Features

### 🔐 **Authentication System**
- Role-based access control (Admin, Director, Department Head, Staff)
- Secure login with demo accounts
- Department-specific permissions

### 📊 **Dashboard**
- Real-time statistics and metrics
- Recent requests overview
- Department-wise data filtering

### 📝 **Request Management**
- **Money Requests**: Submit and approve financial requests with detailed forms
- **Leave Requests**: Manage annual, sick, and emergency leave with date calculations
- **Approval Workflow**: Department heads and directors can approve/reject requests
- **Template Downloads**: Generate printable request forms

### 👥 **Staff Directory**
- Complete staff information management
- Department organization
- Contact information and roles
- Add/edit staff members (Admin only)

### 🏢 **Department Management**
- View all organizational departments
- Staff count per department
- Add new departments (Admin only)

## Demo Accounts

| Username | Password | Role | Department |
|----------|----------|------|------------|
| admin | admin | Admin | Communications |
| accounts | acc123 | Department Head | Accounts |
| hr | hr123 | Department Head | HR |
| director | dir123 | National Director | National Director |
| media | media123 | Department Head | Media |

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom gradients
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: Bun
- **UI Components**: Custom components with shadcn/ui inspiration

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) package manager

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd sightly-dashboards
```

2. Install dependencies:
```sh
bun install
```

3. Start the development server:
```sh
bun run dev
```

The application will be available at `http://localhost:5173`.

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run build:dev` - Build for development
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint
- `bun run test` - Run tests
- `bun run test:watch` - Run tests in watch mode

## Deployment

This is a static site that can be deployed to any static hosting service:

### Vercel
```sh
bun run build
# Deploy the `dist` folder
```

### Netlify
```sh
bun run build
# Deploy the `dist` folder
```

### GitHub Pages
```sh
bun run build
# Deploy the `dist` folder
```

## Project Structure

```
src/
├── pages/
│   └── Index.tsx          # Main KYFC system component
├── components/
│   ├── ui/                # Reusable UI components
│   └── dashboard/         # Dashboard-specific components
├── contexts/              # React contexts for state management
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions
```

## Key Features Overview

### Request Management System
- **Money Requests**: Complete financial request workflow with approval chains
- **Leave Management**: Automated leave calculations and coverage assignments
- **Document Generation**: Downloadable request templates for offline processing

### User Management
- **Role-Based Access**: Different permissions for different user types
- **Department Filtering**: Users see relevant data based on their department
- **Staff Administration**: Add, edit, and manage staff information

### Dashboard Analytics
- **Real-time Metrics**: Live updates of request statuses and counts
- **Department Overview**: Visual representation of organizational structure
- **Quick Actions**: Fast access to common tasks

## Security Features

- Client-side authentication (demo purposes)
- Role-based permissions
- Department-specific data isolation
- Secure form handling

## Future Enhancements

- Backend API integration
- Database persistence
- Email notifications
- Advanced reporting
- Mobile app version

---

**Built for Kenya Youth For Christ** - Empowering youth ministry through efficient management systems.
