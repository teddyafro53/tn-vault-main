# TN Vault - Deployment Guide

This guide walks you through deploying TN Vault to GitHub and Vercel.

## Step 1: Create GitHub Repository

GitHub no longer supports password authentication for git operations. You need to create a personal access token:

### Create Personal Access Token on GitHub

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: `tn-vault-deploy`
4. Select scopes:
   - `repo` (full control of private repositories)
   - `workflow` (update GitHub Action workflows)
5. Click "Generate token"
6. **Copy the token** - you'll use it for authentication

### Create Repository via GitHub Web UI

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `tn-vault`
   - **Description**: "A secure digital vault for storing important images and documents online"
   - **Visibility**: Public
3. Click "Create repository"

### Push Code to GitHub

1. In your terminal, navigate to the project:
```bash
cd /home/ubuntu/tn-vault
```

2. Set the git remote:
```bash
git remote set-url origin https://tedyafro53:YOUR_PERSONAL_ACCESS_TOKEN@github.com/tedyafro53/tn-vault.git
```
Replace `YOUR_PERSONAL_ACCESS_TOKEN` with the token you generated above.

3. Push the code:
```bash
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Sign in with your GitHub account
3. Click "Add New..." → "Project"
4. Select the `tn-vault` repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
7. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Authenticate:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

4. When prompted, set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Step 3: Configure Supabase

Before the app is fully functional, you need to set up Supabase:

### Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage**
3. Click **Create a new bucket**
4. Name: `vault-images`
5. Make it **Public**
6. Click **Create bucket**

### Create Database Table

Go to **SQL Editor** and run:

```sql
CREATE TABLE user_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_files_user_id ON user_files(user_id);
```

### Enable Row-Level Security

Run this SQL:

```sql
ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own files"
  ON user_files
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own files"
  ON user_files
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files"
  ON user_files
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own files"
  ON user_files
  FOR UPDATE
  USING (auth.uid() = user_id);
```

### Configure Storage Policies

1. Go to **Storage** → **vault-images** bucket
2. Click **Policies** tab
3. Add policies for authenticated users:
   - SELECT (read)
   - INSERT (upload)
   - DELETE (remove files)

## Step 4: Verify Deployment

1. Visit your Vercel deployment URL (e.g., `https://tn-vault.vercel.app`)
2. Test the following flows:
   - Sign up with a new email
   - Sign in with your credentials
   - Upload an image
   - View gallery
   - Download an image
   - Delete an image
   - Logout

## Troubleshooting

### Deployment fails with "Cannot find module"
- Ensure all dependencies are installed: `pnpm install`
- Check that `pnpm-lock.yaml` is committed to git

### Upload returns 403 error
- Verify `vault-images` bucket exists and is public
- Check storage RLS policies are configured
- Ensure `user_files` table exists

### Authentication fails
- Verify Supabase credentials are correct in environment variables
- Check that email provider is enabled in Supabase Auth
- Clear browser cookies and try again

### Gallery shows no files
- Ensure `user_files` table is created with correct schema
- Verify RLS policies allow SELECT for authenticated users
- Check browser console for errors

## Custom Domain (Optional)

To use a custom domain:

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

## Environment Variables

Make sure these are set in Vercel:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |

## Monitoring

### View Logs

In Vercel dashboard:
1. Go to your project
2. Click **Deployments**
3. Select a deployment
4. Click **Logs** to view build and runtime logs

### Monitor Performance

1. Go to **Analytics** in Vercel dashboard
2. View page views, response times, and errors

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

1. Make changes locally
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Your message"
git push
```
3. Vercel automatically builds and deploys

## Rollback

To rollback to a previous deployment:

1. In Vercel dashboard, go to **Deployments**
2. Find the deployment you want to restore
3. Click the three dots menu
4. Click **Promote to Production**

## Support

For issues:
- Check Vercel logs for build errors
- Check browser console for runtime errors
- Verify Supabase configuration
- Review SUPABASE_SETUP.md for database setup

---

**Next Steps:**
1. Create personal access token on GitHub
2. Create repository on GitHub
3. Push code using the token
4. Deploy to Vercel
5. Configure Supabase
6. Test all features
