# Adviso Lead Centre

A modern Lead Management System built with React, TypeScript, Vite, and Supabase.

## 🚀 Features

- **Modern Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase with PostgreSQL database
- **Real-time Data**: Live updates and synchronization
- **Type Safety**: Full TypeScript integration with database types
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Code Quality**: ESLint, Prettier, and pre-commit hooks

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

## 🗄️ Database Schema

The application uses the following main tables:

- **leads**: Core lead information and tracking
- **user_profiles**: User management and authentication
- **client_tasks**: Task management for leads
- **contacts**: Contact information for each lead
- **activities**: Activity tracking and history
- **teams**: Team management and assignments

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run gen:types` - Generate TypeScript types from Supabase

## 🏗️ Project Structure

```
src/
├── lib/
│   ├── supabaseClient.ts    # Supabase client configuration
│   ├── database.types.ts    # Generated TypeScript types
│   └── utils.ts            # Utility functions
├── components/             # React components
├── pages/                 # Page components
├── hooks/                 # Custom React hooks
└── App.tsx               # Main application component
```

## 🔧 Development

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

### Database Types

TypeScript types are generated from the Supabase database schema. To update types after database changes:

```bash
npm run gen:types
```

## 🚀 Deployment

The project is ready for deployment on platforms like:
- Vercel
- Netlify
- Railway
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.
