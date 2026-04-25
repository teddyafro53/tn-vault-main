# TN Vault - Secure Digital Vault

A modern, secure web application for storing and managing important images and documents online. Built with Next.js, React, Tailwind CSS, and Supabase.

## Features

- **Secure Authentication**: Email/password sign-up and sign-in powered by Supabase Auth
- **Cloud Storage**: Upload and store images in Supabase Storage with automatic organization
- **Dark Theme**: Beautiful dark interface with blue-to-purple gradient accents and glassmorphism effects
- **Drag & Drop Upload**: Intuitive file upload with support for PNG, JPG, GIF, and WebP formats
- **Gallery View**: Browse all your uploaded files with metadata and preview
- **File Management**: Download or delete files with one click
- **Row-Level Security**: Users can only access their own files
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, Vite
- **Backend**: Express.js, tRPC
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Icons**: Lucide React
- **UI Components**: shadcn/ui, Radix UI

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account and project
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tedyafro53/tn-vault.git
cd tn-vault
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Create .env.local with your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase (see SUPABASE_SETUP.md):
   - Create `vault-images` storage bucket
   - Create `user_files` database table
   - Configure Row-Level Security policies

5. Start the development server:
```bash
pnpm dev
```

6. Open http://localhost:3000 in your browser

## Project Structure

```
tn-vault/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components (Home, SignUp, SignIn, Dashboard, Upload, Gallery)
│   │   ├── components/    # Reusable components (Sidebar, etc.)
│   │   ├── hooks/         # Custom hooks (useSupabaseAuth)
│   │   ├── lib/           # Utilities (Supabase client)
│   │   ├── App.tsx        # Main app router
│   │   └── index.css      # Global styles with dark theme
│   └── public/            # Static assets
├── server/                # Backend Express server
│   ├── routers.ts         # tRPC procedures
│   ├── db.ts              # Database queries
│   └── auth.*.test.ts     # Test files
├── drizzle/               # Database schema and migrations
├── SUPABASE_SETUP.md      # Supabase configuration guide
└── README.md              # This file
```

## Usage

### Sign Up
1. Click "Get Started" on the landing page
2. Enter your name, email, and password
3. Click "Create Account"

### Sign In
1. Click "Sign In" on the landing page
2. Enter your email and password
3. Click "Sign In"

### Upload Files
1. Navigate to "Upload" from the sidebar
2. Drag and drop images or click to select files
3. Supported formats: PNG, JPG, GIF, WebP (max 10MB)

### View Gallery
1. Navigate to "Gallery" from the sidebar
2. Browse all your uploaded files
3. Download or delete files as needed

### Dashboard
1. View your total files and storage usage
2. Quick links to upload or view gallery

## Testing

Run the test suite:
```bash
pnpm test
```

Tests cover:
- Supabase authentication connectivity
- Storage bucket access
- Authentication flow validation

## Deployment

### Deploy to Vercel

1. Push code to GitHub:
```bash
git push origin main
```

2. Connect to Vercel:
   - Go to https://vercel.com
   - Import the GitHub repository
   - Configure environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Deploy

3. Set up Supabase:
   - Follow instructions in SUPABASE_SETUP.md
   - Create storage bucket and database table
   - Configure RLS policies

## Environment Variables

Required environment variables for production:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Security

- All files are encrypted in transit (HTTPS)
- Row-Level Security ensures users can only access their own files
- Passwords are securely hashed by Supabase Auth
- Storage bucket is configured with proper access controls

## Troubleshooting

### Upload fails
- Check that `vault-images` bucket exists and is public
- Verify RLS policies are correctly configured
- Ensure `user_files` table exists

### Authentication fails
- Verify Supabase credentials in environment variables
- Check that email provider is enabled in Supabase Auth
- Clear browser cookies and try again

### Gallery shows no files
- Ensure `user_files` table is created
- Verify RLS policies allow SELECT for authenticated users
- Check that files were uploaded to correct storage path

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub or contact the development team.

## Roadmap

- [ ] File sharing with expiring links
- [ ] Folder organization
- [ ] Advanced search and filtering
- [ ] Image editing tools
- [ ] Batch operations
- [ ] Mobile app
- [ ] Two-factor authentication
- [ ] Team collaboration features

---

Built with ❤️ by the TN Vault team
