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

### Step 3: Set Environment Variables (Required!)

Your project uses environment variables to keep API keys secure:

1. In Vercel project settings, go to **Settings** → **Environment Variables**
2. Add the following variable:
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: Your actual OpenRouter API key
   - **Environments**: Select all (Production, Preview, Development)
3. Optionally add:
   - **Name**: `ENABLE_AI_RECOMMENDATIONS`
   - **Value**: `true` or `false`
   - **Environments**: Select all

**Important**: The build script (`build-config.js`) will automatically inject these values into `config.js` during deployment, keeping your secrets safe.

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will automatically:
   - Install dependencies (`npm install`)
   - Run the build script (`npm run build`) to generate `config.js`
   - Deploy your site
3. Wait 1-2 minutes for deployment
4. Your site will be live at: `https://your-project-name.vercel.app`

## Method 2: Deploy via Vercel CLI (For Advanced Users)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Set Environment Variables

Before deploying, set your environment variables:
```bash
vercel env add OPENROUTER_API_KEY
```
Enter your API key when prompted. Repeat for `ENABLE_AI_RECOMMENDATIONS` if needed.

Or set them in the Vercel dashboard: **Settings** → **Environment Variables**

### Step 4: Deploy

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

The build script will automatically run and generate `config.js` from your environment variables.

### Step 5: Production Deploy

For production deployment:
```bash
vercel --prod
```

This will use your production environment variables set in Vercel.

## Configuration Files

### vercel.json

The `vercel.json` file configures:
- Build command: Runs `npm install && npm run build` to generate `config.js` from environment variables
- Proper routing for your static files
- Security headers
- Asset caching

### Environment Variables Setup

Your project uses a build-time approach to inject environment variables:

1. **Local Development:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your API key
   OPENROUTER_API_KEY=your-actual-api-key-here
   
   # Generate config.js
   npm install
   npm run build
   ```

2. **Vercel Deployment:**
   - Go to your project → Settings → Environment Variables
   - Add: `OPENROUTER_API_KEY` with your actual key
   - Select environments: Production, Preview, Development
   - The build script automatically injects these during deployment

3. **How it works:**
   - `build-config.js` reads environment variables (from `.env` locally or Vercel env vars)
   - Generates `js/config.js` with the values injected
   - `config.js` is gitignored, so secrets never get committed
   - GitGuardian will no longer detect leaked secrets! ✅

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
- **Solution**: 
  - Check environment variables are set correctly in Vercel dashboard
  - Ensure `OPENROUTER_API_KEY` is set for the correct environment (Production/Preview)
  - Check build logs to verify the build script ran successfully
  - For local dev: Ensure `.env` file exists and run `npm run build`

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

## Local Development Setup

Before running locally, set up your environment:

```bash
# 1. Install dependencies
npm install

# 2. Create .env file from template
cp .env.example .env

# 3. Edit .env and add your API key
# OPENROUTER_API_KEY=your-actual-key-here

# 4. Generate config.js from .env
npm run build

# 5. Open index.html in your browser or use a local server
```

**Note**: Every time you change `.env`, run `npm run build` to regenerate `config.js`.

## Security Best Practices

1. ✅ Never commit `config.js` with real API keys (already in `.gitignore`)
2. ✅ Never commit `.env` file (already in `.gitignore`)
3. ✅ Use `.env.example` as a template (committed, no secrets)
4. ✅ Use environment variables for sensitive data
5. ✅ Build script injects env vars at build time, not runtime
6. ✅ Enable Vercel's security headers (configured in `vercel.json`)
7. ✅ Use preview deployments for testing before production
8. ✅ GitGuardian will no longer detect secrets! 🎉

## Next Steps

- Set up environment variables for your API key
- Configure a custom domain
- Set up monitoring and analytics
- Enable Vercel Analytics (optional)

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

