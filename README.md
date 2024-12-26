# SPV Setup Application

A modern web application for managing Special Purpose Vehicle (SPV) setups and investments.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Supabase account and project

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd spv-setup-app
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Create a `.env` file in the root directory:
```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional Configuration
REACT_APP_API_URL=your_api_url
REACT_APP_MAX_FILE_SIZE=10485760  # 10MB in bytes
```

## Environment Variables

### Required Variables:
- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
  - Found in: Supabase Dashboard > Project Settings > API
  - Example: `https://xxxxxxxxxxxxx.supabase.co`

- `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key
  - Found in: Supabase Dashboard > Project Settings > API > anon/public
  - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Optional Variables:
- `REACT_APP_API_URL`: Base URL for API calls (if using external APIs)
- `REACT_APP_MAX_FILE_SIZE`: Maximum file size for uploads in bytes

## Database Setup

1. Set up the following tables in your Supabase database:
   - spv_basic_info
   - spv_terms
   - spv_carry
   - spv_deal_memo
   - spv_signatures
   - spv_activity_log
   - spv_invited_users
   - user_roles

2. Enable Row Level Security (RLS) policies for each table

## Running the Application

1. Start the development server:
```bash
npm start
```

2. Build for production:
```bash
npm run build --legacy-peer-deps
```

3. The application will be available at:
- Development: `http://localhost:3000`
- Production: Your deployed URL

## Features

- Multi-step SPV setup form with validation
- Document upload functionality
- E-signature capability
- Real-time search and filtering
- Role-based access control
- Activity logging
- Draft saving functionality

## Important Notes

1. Use `npm install --legacy-peer-deps` for installation to resolve dependency conflicts

2. Ensure all required environment variables are set before starting the application

3. Configure Supabase storage buckets for:
   - Document uploads
   - Company logos
   - Signature data

4. Set up appropriate CORS policies in your Supabase project

5. Enable authentication in Supabase and configure the following providers:
   - Email/Password
   - Magic Link (optional)
   - OAuth providers (if needed)

## Troubleshooting

1. If you encounter dependency issues:
```bash
rm -rf node_modules
rm package-lock.json
npm install --legacy-peer-deps
```

2. If environment variables are not being recognized:
   - Ensure .env file is in the root directory
   - Restart the development server
   - Prefix all variables with REACT_APP_

3. For file upload issues:
   - Check Supabase storage bucket permissions
   - Verify file size limits
   - Ensure correct CORS configuration
