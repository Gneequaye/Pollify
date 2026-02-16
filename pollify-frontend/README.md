# Dashboard Application

A modern dashboard application built with React, TypeScript, and Vite. Originally migrated from Next.js to Vite for improved development experience and build performance.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Charts**: Interactive data visualization with Recharts
- **Data Tables**: Advanced tables with sorting, filtering, pagination, and drag-and-drop
- **Theme Support**: Dark/Light mode with system preference detection
- **Icons**: Tabler Icons and Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router DOM

## 📦 Tech Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.21
- **Language**: TypeScript 5.6.3
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Drag & Drop**: dnd-kit
- **Forms**: React Hook Form + Zod
- **Routing**: React Router DOM 6.28.0

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build
```

### Preview Production Build

```bash
# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
├── src/
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   ├── globals.css          # Global styles
│   ├── pages/               # Page components
│   │   └── DashboardPage.tsx
│   └── data/                # Static data files
│       └── data.json
├── components/              # React components
│   ├── ui/                  # UI component library (shadcn/ui)
│   ├── app-sidebar.tsx      # Application sidebar
│   ├── chart-area-interactive.tsx
│   ├── data-table.tsx       # Advanced data table
│   ├── section-cards.tsx    # Dashboard cards
│   ├── site-header.tsx      # Site header
│   └── theme-provider.tsx   # Theme management
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🎨 Key Components

### Dashboard
- **Section Cards**: Display key metrics with trends
- **Interactive Charts**: Area charts with time range selection
- **Data Table**: Sortable, filterable table with pagination and drag-and-drop

### Sidebar
- Collapsible navigation
- Multiple navigation sections (Main, Documents, Secondary)
- User profile menu

### Theme System
- Light/Dark mode support
- System preference detection
- Persistent theme selection

## 🔧 Configuration

### Path Aliases

The project uses `@/` as an alias for the root directory:

```typescript
import { Button } from '@/components/ui/button'
```

### Tailwind CSS

Custom CSS variables are defined in `src/globals.css` for easy theming.

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚧 Migration Notes

This project was migrated from Next.js to Vite. Key changes include:

- Removed Next.js specific features (`use client`, `next/font`, `next/image`)
- Replaced Next.js routing with React Router
- Converted `next-themes` to custom theme provider
- Updated build configuration for Vite
- Adjusted TypeScript configuration

## 📄 License

Private project.

## 🤝 Contributing

This is a private project. Please contact the repository owner for contribution guidelines.
