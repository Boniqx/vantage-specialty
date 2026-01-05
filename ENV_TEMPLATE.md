# Environment Variables Template for Vantage Specialty EHR
# Copy this file to .env.local and fill in your values

# ===========================================
# Supabase Configuration
# ===========================================

# Your Supabase project URL (from Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Your Supabase anon/public key (safe to expose to client)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Service role key (for server-side operations only)
# WARNING: Never expose this to the client!
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ===========================================
# Setup Instructions
# ===========================================
# 1. Create a Supabase project at https://supabase.com
# 2. Run the schema.sql file in the SQL Editor
# 3. Copy your project URL and anon key from Settings > API
# 4. Create a .env.local file with the values above
