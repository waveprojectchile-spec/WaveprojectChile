import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-key-for-build-process';

if (process.env.NODE_ENV === 'production' && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ CRÍTICO: SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_URL faltan en entorno de producción.');
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
