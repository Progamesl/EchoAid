# 🚀 EchoAid Deployment Guide - Vercel

## Quick Deploy to Vercel

### Step 1: Prepare Your Project
1. Make sure your project is in a Git repository (GitHub, GitLab, etc.)
2. Ensure all dependencies are installed: `npm install`
3. Test your build locally: `npm run build`

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)**
   - Sign up/Login with your GitHub, GitLab, or Bitbucket account

2. **Import Your Project**
   - Click "New Project"
   - Import your Git repository
   - Vercel will automatically detect it's a React app

3. **Configure Build Settings**
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. **Environment Variables**
   - Add your OpenAI API key:
     - **Name**: `REACT_APP_OPENAI_API_KEY`
     - **Value**: Your OpenAI API key
   - Add backend URL (if needed):
     - **Name**: `REACT_APP_API_URL`
     - **Value**: Your backend URL

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts**
   - Link to existing project or create new
   - Set up environment variables
   - Deploy

### Step 3: Configure Backend (Optional)

If you want to deploy the backend too:

1. **Create a new Vercel project for the backend**
2. **Update the server.js for Vercel**:
   ```javascript
   // Add this to server.js
   const PORT = process.env.PORT || 3001;
   ```

3. **Deploy backend separately**
4. **Update frontend API URL** to point to your backend

### Step 4: Custom Domain (Optional)

1. **In Vercel Dashboard**
   - Go to your project
   - Click "Settings" → "Domains"
   - Add your custom domain

2. **Configure DNS**
   - Follow Vercel's DNS instructions
   - Wait for propagation (up to 24 hours)

## Environment Variables

Make sure to set these in Vercel:

```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
```

## Build Optimization

### For Better Performance:

1. **Optimize Images**
   - Use WebP format
   - Compress images
   - Use lazy loading

2. **Code Splitting**
   - Already configured in React
   - Consider route-based splitting

3. **Caching**
   - Vercel handles static assets
   - Configure API caching if needed

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check console for errors
   - Ensure all dependencies are in package.json
   - Verify environment variables

2. **API Not Working**
   - Check CORS settings
   - Verify API endpoints
   - Test locally first

3. **Environment Variables**
   - Must start with `REACT_APP_` for client-side
   - Restart deployment after adding

### Performance Tips:

1. **Enable Vercel Analytics**
   - Get performance insights
   - Monitor user experience

2. **Use Vercel Edge Functions**
   - For API routes
   - Better performance

3. **Optimize Bundle Size**
   - Use `npm run build --analyze`
   - Remove unused dependencies

## Demo Preparation

### Before Recording:

1. **Test Everything**
   - All features work
   - AI integration works
   - Crisis intervention works
   - Voice recorder works

2. **Prepare Script**
   - Follow DEMO.md
   - Have backup screenshots
   - Test on different devices

3. **Check Performance**
   - Load time < 3 seconds
   - Smooth animations
   - Responsive design

### Recording Tips:

1. **Use Screen Recording Software**
   - OBS Studio (free)
   - Loom (web-based)
   - QuickTime (Mac)

2. **Show Key Features**
   - AI Wellness Coach
   - Crisis Intervention
   - Voice Recording
   - Resources Page
   - Beautiful UI

3. **Keep it Under 5 Minutes**
   - Focus on impact
   - Show technical skills
   - Highlight social good

## Post-Deployment

### After Deploying:

1. **Test Live Site**
   - All features work
   - Mobile responsive
   - Performance is good

2. **Share Your Demo**
   - Record video demo
   - Prepare presentation
   - Have backup plan

3. **Monitor Performance**
   - Check Vercel analytics
   - Monitor API usage
   - Track user engagement

## Quick Commands

```bash
# Build locally
npm run build

# Test production build
npm run build && npx serve -s build

# Deploy to Vercel
vercel

# Deploy with production settings
vercel --prod
```

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **React Deployment**: [create-react-app.dev/docs/deployment](https://create-react-app.dev/docs/deployment)
- **OpenAI API**: [platform.openai.com/docs](https://platform.openai.com/docs)

---

**🎉 Your EchoAid app is now live and ready for your hackathon demo!**
