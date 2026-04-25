# Supabase Setup Instructions for TN Vault

This document outlines the manual setup required in Supabase to make TN Vault fully functional.

## 1. Create Storage Bucket

Navigate to your Supabase project dashboard and follow these steps:

1. Go to **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Name the bucket: `vault-images`
4. Make it **Public** (required for image URLs)
5. Click **Create bucket**

## 2. Create Database Table for File Metadata

Navigate to the **SQL Editor** and run the following SQL to create the `user_files` table:

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

-- Create index for faster queries
CREATE INDEX idx_user_files_user_id ON user_files(user_id);
```

## 3. Set Up Row-Level Security (RLS)

Run the following SQL to enable RLS policies so users can only see their own files:

```sql
-- Enable RLS on user_files table
ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own files
CREATE POLICY "Users can view their own files"
  ON user_files
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own files
CREATE POLICY "Users can insert their own files"
  ON user_files
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete their own files"
  ON user_files
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Users can update their own files
CREATE POLICY "Users can update their own files"
  ON user_files
  FOR UPDATE
  USING (auth.uid() = user_id);
```

## 4. Configure Storage RLS Policies

In the **Storage** section, click on the `vault-images` bucket and add these policies:

1. **Public Read Access** (for viewing images):
   - Go to **Policies** tab
   - Click **New Policy** → **For queries**
   - Select **SELECT**
   - Authenticated role
   - Click **Review** and **Save**

2. **User Upload Access**:
   - Click **New Policy** → **For queries**
   - Select **INSERT**
   - Authenticated role
   - Click **Review** and **Save**

3. **User Delete Access**:
   - Click **New Policy** → **For queries**
   - Select **DELETE**
   - Authenticated role
   - Click **Review** and **Save**

## 5. Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email settings if needed (optional for development)

## Verification

After completing these steps:

1. Users should be able to sign up with email/password
2. Users can upload images to `vault-images` bucket
3. File metadata is stored in `user_files` table
4. Users can only see their own files (RLS enforced)
5. Users can download and delete their files

## Troubleshooting

If uploads fail:
- Check that `vault-images` bucket is public
- Verify RLS policies are correctly set
- Ensure `user_files` table exists with correct schema

If authentication fails:
- Verify email provider is enabled in Supabase
- Check that credentials are correctly set in environment variables
