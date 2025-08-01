# Staff Check-in System

A lightweight React web application for daily staff check-ins, backed by Supabase.

## Features

- **Simple Login**: Staff authenticate using only their tag/PIN
- **Quick Check-in**: One-click daily check-in with timestamp
- **Success Confirmation**: Clear feedback after successful check-in
- **Admin Dashboard**: View and filter check-ins by date with real-time updates
- **User Profile**: Calendar view of personal check-in history
- **Fingerprint Integration**: Webhook endpoint for hardware fingerprint scanners

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Routing**: React Router
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. In your project dashboard, go to Settings > API
3. Copy your project URL and anon key
4. Update the `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Migration

The database schema is automatically created through the migration file. It includes:

- `staff` table: Staff members with tags and fingerprint IDs
- `cafeRegister` table: Check-in records with timestamps
- Sample data with 4 test staff members

### 3. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Test the Application

Use these sample staff tags to test:
- `JD001` - John Doe
- `JS002` - Jane Smith  
- `MJ003` - Mike Johnson
- `SW004` - Sarah Wilson

## Deployment

### Option 1: Netlify (Recommended)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Option 2: Other Platforms
- Vercel: Deploy directly from GitHub
- Railway: Supports React builds
- Any static hosting service

## Fingerprint Scanner Integration

The application includes a webhook endpoint at `/supabase/functions/fingerprint-checkin` that:

1. Receives fingerprint_id from hardware scanner
2. Looks up corresponding staff member
3. Creates check-in record automatically
4. Returns success/error response

**Webhook URL**: `https://your-project.supabase.co/functions/v1/fingerprint-checkin`

**Request Format**:
```json
{
  "fingerprint_id": "fp_001"
}
```

## Design Philosophy

- **Ultra-minimal**: Clean, distraction-free interface
- **Mobile-first**: Optimized for all screen sizes
- **Fast**: Quick check-in process with immediate feedback
- **Reliable**: Real-time updates and error handling

## Security

- Row Level Security (RLS) enabled on all tables
- Public read access for staff lookup (required for login)
- Public insert access for check-ins (required for functionality)
- No sensitive data exposed in frontend

## Customization

- **Colors**: Modify Tailwind classes for different color schemes
- **Branding**: Update header and styling in Layout component
- **Fields**: Add custom fields to staff/check-in tables as needed
- **Validation**: Enhance login validation for additional security

## Support

For questions or issues, contact your system administrator or refer to the Supabase documentation for backend-related queries.#   s t a f f - t o k e n - c h e c k i n s  
 