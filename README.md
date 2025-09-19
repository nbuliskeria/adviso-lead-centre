# 🎯 Adviso Lead Centre

> **Production-Ready Enterprise CRM** - A sophisticated lead management system with comprehensive client onboarding, analytics dashboard, and task management capabilities.

[![TypeScript](https://img.shields.io/badge/TypeScript-0_errors-success)](https://www.typescriptlang.org/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://vitejs.dev/)
[![Production Ready](https://img.shields.io/badge/Production-Ready-blue)](./DEPLOYMENT.md)

## ✨ **Key Features**

### 🎨 **Modern Architecture**
- **React 19.1.1** with latest features and optimizations
- **TypeScript 5.8.3** with zero compilation errors
- **Vite 7.1.2** for lightning-fast development and builds
- **Tailwind CSS v4.1.13** with custom design system

### 🗄️ **Enterprise Backend**
- **Supabase** with PostgreSQL database
- **Edge Functions** for complex business logic
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** for live updates

### 📊 **Business Intelligence**
- **Interactive Dashboard** with Recharts visualizations
- **Lead Analytics** with conversion tracking
- **Performance Metrics** with period comparisons
- **Drill-down Navigation** to detailed views

### 🎯 **Lead Management**
- **Multi-step Wizard** for lead creation
- **Kanban Board** with drag-and-drop functionality
- **Advanced Filtering** and search capabilities
- **Automated Lead-to-Client Conversion**

### 👥 **Client Onboarding**
- **Dynamic Form Arrays** with useFieldArray
- **Technical Integration** (RS.GE, Bank APIs)
- **Onboarding Playbooks** with task templates
- **Progress Tracking** and status management

### ⚡ **Performance & UX**
- **Bundle Size**: 299KB gzipped (optimized)
- **Theme System**: Light/Dark/System modes
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG AA compliant

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd adviso-lead-centre
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄️ **Database Schema**

### Core Tables
- **`leads`** - Lead information, status tracking, and conversion pipeline
- **`clients`** - Converted clients with onboarding status
- **`client_tasks`** - Task management and assignment system
- **`user_profiles`** - User authentication and role management
- **`activities`** - Comprehensive audit trail and activity logging
- **`task_templates`** - Onboarding playbooks and automation

### Advanced Features
- **Row Level Security (RLS)** for data protection
- **Edge Functions** for complex business logic
- **Real-time subscriptions** for live updates
- **JSONB fields** for flexible data structures

## 📝 **Available Scripts**

```bash
# Development
npm run dev              # Start development server (localhost:5173)
npm run build           # Build for production (dist/)
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint checks
npm run lint:fix        # Auto-fix ESLint issues
npm run type-check      # TypeScript compilation check

# Database
npm run gen:types       # Generate TypeScript types from Supabase
```

## 🏗️ **Project Architecture**

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── leads/              # Lead management components
│   ├── clients/            # Client onboarding components
│   ├── tasks/              # Task management components
│   ├── dashboard/          # Analytics and charts
│   └── admin/              # Admin panel components
├── pages/                  # Route-level page components
├── hooks/
│   ├── queries/            # React Query data hooks
│   └── useAuth.ts          # Authentication logic
├── lib/
│   ├── supabaseClient.ts   # Database client
│   ├── database.types.ts   # Generated TypeScript types
│   ├── constants.ts        # UI constants and options
│   └── schemas.ts          # Zod validation schemas
└── context/                # React Context providers
```

## 🎯 **Core Workflows**

### 1. Lead Management
```
Lead Creation → Qualification → Negotiation → Conversion → Client
```

### 2. Client Onboarding
```
Conversion → Profile Setup → Technical Integration → Provisioning → Active
```

### 3. Task Management
```
Template Application → Assignment → Progress Tracking → Completion
```

## 🔧 **Development Guidelines**

### Code Quality Standards
- ✅ **TypeScript**: Zero compilation errors enforced
- ✅ **ESLint**: Production-ready code standards
- ✅ **React Hook Form**: Advanced form state management
- ✅ **Zod Validation**: Type-safe schema validation
- ✅ **React Query**: Server state management and caching

### Component Patterns
- **Compound Components**: For complex UI patterns
- **Custom Hooks**: For business logic abstraction
- **Context Providers**: For global state management
- **Error Boundaries**: For graceful error handling

## 🚀 **Production Deployment**

### Quick Deploy
```bash
# Build for production
npm run build

# Deploy to Netlify/Vercel
# Upload dist/ folder or connect Git repository
```

### Environment Configuration
```env
# Production Environment Variables
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

### Database Setup
```bash
# Run migrations
supabase migration up

# Deploy Edge Functions
supabase functions deploy convert-lead-to-client
supabase functions deploy apply-onboarding-template

# Generate types
npm run gen:types
```

**📖 See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guide**

## 📊 **Performance Metrics**

- **Bundle Size**: 299KB (gzipped)
- **Build Time**: ~3.5 seconds
- **TypeScript**: 0 compilation errors
- **ESLint**: Production-ready standards
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)

## 🎨 **Design System**

### Brand Colors
- **Primary**: Adviso Purple (#612183)
- **Accent**: Bright Purple (#B257EF)
- **Success**: Green (#3F9444)
- **Warning**: Yellow (#F8A812)
- **Error**: Red (#FD693F)

### Theme System
- **Light Mode**: Professional business interface
- **Dark Mode**: Modern glassmorphism effects
- **System**: Automatic OS preference detection

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Setup
```bash
git clone <your-fork>
cd adviso-lead-centre
npm install
npm run dev
```

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ **Support**

- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: GitHub Issues tab
- **Discussions**: GitHub Discussions

---

## 🏆 **Production Ready Enterprise CRM**

**The Adviso Lead Centre represents a sophisticated, production-ready CRM solution with enterprise-grade architecture, comprehensive feature set, and modern development practices. Built with React 19, TypeScript, and Supabase - ready for immediate deployment and scale.**

**🚀 [Deploy Now](./DEPLOYMENT.md) | 📊 [View Demo](#) | 📖 [Documentation](./DEPLOYMENT.md)**

For support and questions, please open an issue in the GitHub repository.
