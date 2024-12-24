import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize database schema
async function initializeDatabase() {
  const { error } = await supabase.rpc('initialize_spv_schema', {});
  if (error) {
    console.error('Error initializing database:', error);
  }
}

// Create the stored procedure in Supabase SQL editor:
/*
create or replace function initialize_spv_schema()
returns void
language plpgsql
security definer
as $$
begin
  -- Create SPVs table if it doesn't exist
  create table if not exists spvs (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    company_name text not null,
    transaction_type text not null,
    instrument_list text not null,
    allocation numeric not null,
    status text not null default 'Draft',
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- Create trigger to update updated_at timestamp
  create or replace function update_updated_at_column()
  returns trigger
  language plpgsql
  as $$
  begin
    new.updated_at = timezone('utc'::text, now());
    return new;
  end;
  $$;

  -- Create trigger if it doesn't exist
  drop trigger if exists update_spvs_updated_at on spvs;
  create trigger update_spvs_updated_at
    before update on spvs
    for each row
    execute function update_updated_at_column();
end;
$$;
*/

export { initializeDatabase };
