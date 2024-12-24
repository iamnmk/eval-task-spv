import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;

// Regular client for normal operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role key for admin operations
export const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize database schema
async function initializeDatabase() {
  // Update the status enum type
  const updateStatusTypeSQL = `
    DO $$ 
    BEGIN 
      -- Drop existing enum type if it exists
      DROP TYPE IF EXISTS spv_status_type CASCADE;
      
      -- Create new enum type with updated values
      CREATE TYPE spv_status_type AS ENUM ('draft', 'approved', 'rejected', 'in progress');
      
      -- Update existing columns to use new type with default value
      ALTER TABLE spvs 
        ALTER COLUMN status TYPE spv_status_type USING status::text::spv_status_type,
        ALTER COLUMN status SET DEFAULT 'draft';
        
      ALTER TABLE spv_activity_log 
        ALTER COLUMN new_status TYPE spv_status_type USING new_status::text::spv_status_type,
        ALTER COLUMN previous_status TYPE spv_status_type USING 
          CASE 
            WHEN previous_status = 'submitted' THEN 'approved'
            ELSE previous_status::text
          END::spv_status_type;
    EXCEPTION
      WHEN others THEN
        NULL;
    END $$;
  `;

  const { error: schemaError } = await adminSupabase.rpc('initialize_spv_schema', {});
  if (schemaError) {
    console.error('Error initializing database:', schemaError);
  }

  // Update the status type
  const { error: statusTypeError } = await adminSupabase.rpc('exec_sql', { sql: updateStatusTypeSQL });
  if (statusTypeError) {
    console.error('Error updating status type:', statusTypeError);
  }

  // Then set up RLS policies
  const { error: rlsError } = await adminSupabase.rpc('setup_rls_policies', {});
  if (rlsError) {
    console.error('Error setting up RLS policies:', rlsError);
  }
}

// Run database initialization
initializeDatabase().catch(console.error);

export { initializeDatabase };
