# Deploying to Vercel - Complete Guide

This guide will walk you through deploying your Exec Summary Dashboard to Vercel.

## Prerequisites

1. **GitHub Account** (or GitLab/Bitbucket)
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier available)
3. **Your project in a Git repository**

## Method 1: Deploy via Vercel Dashboard (Recommended for Beginners)

### Step 1: Push Your Code to GitHub

1. If you haven't already, initialize a git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub (don't initialize with README)

3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a static site
5. Configure settings:
   - **Framework Preset**: Other (or leave as default)
   - **Root Directory**: `./` (default)
   - **Build Command**: Leave empty (static site, no build needed)
   - **Output Directory**: Leave empty (or set to `.`)

### Step 3: Set Environment Variables (Important!)

Since your `config.js` contains an API key, you should:

**Option A: Use Environment Variables (Recommended)**
1. In Vercel project settings, go to **Settings** → **Environment Variables**
2. Add: `OPENROUTER_API_KEY` = `your-api-key-here`
3. Update your `config.js` to read from environment variables (see below)

**Option B: Keep Current Setup**
- Your current `config.js` will work, but the API key will be visible in the deployed code
- This is fine for development but not recommended for production

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for deployment
3. Your site will be live at: `https://your-project-name.vercel.app`

## Method 2: Deploy via Vercel CLI (For Advanced Users)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Deploy

From your project directory:
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No** (first time) or **Yes** (subsequent deployments)
- Project name? (Enter a name or press Enter for default)
- Directory? **./** (press Enter)
- Override settings? **No** (press Enter)

### Step 4: Production Deploy

For production deployment:
```bash
vercel --prod
```

## Configuration Files

### vercel.json (Optional)

A `vercel.json` file has been created in your project root. This ensures:
- Proper routing for your static files
- Correct headers for security
- Redirect rules if needed

### Environment Variables Setup

To use environment variables instead of hardcoded API keys:

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Environment Variables
   - Add: `OPENROUTER_API_KEY` with your actual key
   - Select environments: Production, Preview, Development

2. **Update config.js** to read from environment variables:
   ```javascript
   const CONFIG = {
       OPENROUTER_API_KEY: window.OPENROUTER_API_KEY || 'YOUR_FALLBACK_KEY',
       // ... rest of config
   };
   ```

   Or use a build-time replacement (requires a build step).

## Continuous Deployment

Once connected to GitHub:
- **Every push to `main` branch** → Auto-deploys to production
- **Every pull request** → Creates a preview deployment
- **Preview URLs** → Share with team for testing before merging

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel handles SSL certificates automatically

## Troubleshooting

### Issue: 404 errors on routes
- **Solution**: Ensure `vercel.json` has proper routing rules

### Issue: API key not working
- **Solution**: Check environment variables are set correctly in Vercel dashboard

### Issue: Assets not loading
- **Solution**: Check file paths are relative (not absolute)
- Ensure all files are committed to git

### Issue: CORS errors
- **Solution**: Configure CORS headers in `vercel.json` if calling external APIs

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove deployment
vercel remove
```

## Security Best Practices

1. ✅ Never commit `config.js` with real API keys (already in `.gitignore`)
2. ✅ Use environment variables for sensitive data
3. ✅ Enable Vercel's security headers (configured in `vercel.json`)
4. ✅ Use preview deployments for testing before production

## Next Steps

- Set up environment variables for your API key
- Configure a custom domain
- Set up monitoring and analytics
- Enable Vercel Analytics (optional)

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

