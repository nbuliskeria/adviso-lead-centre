# 🚀 Vercel Deployment Guide - Adviso Lead Centre

## **📋 DEPLOYMENT SETUP**

### **🔗 Repository Information**
- **GitHub Repository**: `https://github.com/nbuliskeria/adviso-lead-centre`
- **Vercel Username**: `nbuliskeria-2490`
- **Project Name**: "Adviso Lead Centre New"

### **🌍 Environment Strategy**
- **Production**: `main` branch → `adviso-lead-centre-new.vercel.app`
- **Staging**: `staging` branch → `adviso-lead-centre-new-staging.vercel.app`
- **Preview**: Pull requests → `adviso-lead-centre-new-git-[branch].vercel.app`

---

## **🛠️ VERCEL SETUP INSTRUCTIONS**

### **STEP 1: Create Vercel Projects**

#### **1.1 Production Project**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import from GitHub: `nbuliskeria/adviso-lead-centre`
4. **Project Name**: `adviso-lead-centre-new`
5. **Framework Preset**: Vite
6. **Root Directory**: `./` (default)
7. **Build Command**: `npm run build`
8. **Output Directory**: `dist`
9. **Install Command**: `npm install`

#### **1.2 Staging Project**
1. Create another **"New Project"**
2. Import same repository: `nbuliskeria/adviso-lead-centre`
3. **Project Name**: `adviso-lead-centre-new-staging`
4. **Production Branch**: `staging` (instead of main)
5. Same build settings as production

### **STEP 2: Configure Environment Variables**

#### **2.1 Production Environment Variables**
In your production project settings, add:

```bash
# Required Variables
VITE_SUPABASE_URL=https://rjhjegqpclgfovcbuqbj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaGplZ3FwY2xnZm92Y2J1cWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMDAzODgsImV4cCI6MjA3MzY3NjM4OH0.an4f2926wtfLyusBSonHlY0csRiBQfhSfA4cCZdhm7I
NODE_ENV=production
VITE_APP_ENV=production
VITE_APP_NAME=Adviso Lead Centre
VITE_APP_VERSION=1.0.0
```

#### **2.2 Staging Environment Variables**
In your staging project settings, add:

```bash
# Required Variables
VITE_SUPABASE_URL=https://rjhjegqpclgfovcbuqbj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaGplZ3FwY2xnZm92Y2J1cWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMDAzODgsImV4cCI6MjA3MzY3NjM4OH0.an4f2926wtfLyusBSonHlY0csRiBQfhSfA4cCZdhm7I
NODE_ENV=staging
VITE_APP_ENV=staging
VITE_APP_NAME=Adviso Lead Centre (Staging)
VITE_APP_VERSION=1.0.0-staging
VITE_DEBUG_MODE=true
```

---

## **🗄️ SUPABASE CLOUD SETUP**

### **STEP 3: Configure Production Database**

#### **3.1 Run Migrations**
```bash
# Connect to your cloud project
supabase link --project-ref rjhjegqpclgfovcbuqbj

# Push local migrations to cloud
supabase db push

# Verify migrations
supabase migration list
```

#### **3.2 Deploy Edge Functions**
```bash
# Deploy all Edge Functions
supabase functions deploy convert-lead-to-client
supabase functions deploy apply-onboarding-template

# Verify deployment
supabase functions list
```

#### **3.3 Seed Production Data (Optional)**
```bash
# Apply seed data to production
supabase db reset --db-url postgresql://[your-db-url]
```

---

## **🚀 DEPLOYMENT WORKFLOW**

### **Automatic Deployments**

#### **Production Deployment**
```bash
# Any push to main branch triggers production deployment
git checkout main
git add .
git commit -m "feat: production update"
git push origin main
# → Deploys to adviso-lead-centre-new.vercel.app
```

#### **Staging Deployment**
```bash
# Any push to staging branch triggers staging deployment
git checkout staging
git merge main  # or make changes directly
git push origin staging
# → Deploys to adviso-lead-centre-new-staging.vercel.app
```

#### **Preview Deployments**
```bash
# Any pull request creates preview deployment
git checkout -b feature/new-feature
git push origin feature/new-feature
# Create PR → Gets preview URL automatically
```

---

## **🔧 VERCEL CONFIGURATION**

### **Build Settings**
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x (recommended)

### **Domain Settings**
- **Production**: `adviso-lead-centre-new.vercel.app`
- **Staging**: `adviso-lead-centre-new-staging.vercel.app`
- **Custom Domain**: Configure in Vercel dashboard if needed

---

## **✅ VERIFICATION CHECKLIST**

### **After Deployment**
- [ ] Production site loads: `https://adviso-lead-centre-new.vercel.app`
- [ ] Staging site loads: `https://adviso-lead-centre-new-staging.vercel.app`
- [ ] Database connection working (check Lead Database page)
- [ ] Authentication working (Supabase Auth)
- [ ] All pages accessible and functional
- [ ] Environment variables properly set
- [ ] Build logs show no errors

### **Testing**
- [ ] Create a new lead in production
- [ ] Test lead-to-client conversion
- [ ] Verify task management
- [ ] Check dashboard analytics
- [ ] Test responsive design on mobile

---

## **🆘 TROUBLESHOOTING**

### **Common Issues**

#### **Build Failures**
```bash
# Check build logs in Vercel dashboard
# Common fixes:
- Verify all environment variables are set
- Check TypeScript compilation errors
- Ensure all dependencies are in package.json
```

#### **Database Connection Issues**
```bash
# Verify Supabase credentials
- Check VITE_SUPABASE_URL is correct
- Verify VITE_SUPABASE_ANON_KEY is valid
- Ensure RLS policies allow access
```

#### **Environment Variable Issues**
```bash
# In Vercel dashboard:
- Go to Project Settings → Environment Variables
- Ensure all required variables are set
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables
```

---

## **📞 SUPPORT**

### **Resources**
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Repository**: https://github.com/nbuliskeria/adviso-lead-centre

### **Quick Commands**
```bash
# Local development
npm run dev

# Build locally
npm run build

# Preview build
npm run preview

# Generate Supabase types
npm run gen:types
```

**🎉 Your Adviso Lead Centre is now ready for production deployment on Vercel!**
