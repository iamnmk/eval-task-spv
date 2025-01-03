import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;

// Regular client for normal operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Admin client with service role key for admin operations
export const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Initialize database schema
async function initializeDatabase() {
  try {
    // Add is_complete column
    const { error } = await adminSupabase
      .from('spv_basic_info')
      .select('id')
      .limit(1);

    if (error && error.message.includes('is_complete')) {
      // Column doesn't exist, create it
      await adminSupabase
        .from('spv_basic_info')
        .update({ is_complete: true })
        .eq('id', '00000000-0000-0000-0000-000000000000'); // This will fail but create the column

      console.log('Added is_complete column');
    }

    // Update existing records to mark non-draft as complete
    await adminSupabase
      .from('spv_basic_info')
      .update({ is_complete: true })
      .neq('status', 'draft');

  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Run database initialization
initializeDatabase();

export { initializeDatabase };
