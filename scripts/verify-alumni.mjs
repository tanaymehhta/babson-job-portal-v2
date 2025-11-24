// Quick fix to verify existing alumni accounts
// Run with: node scripts/verify-alumni.mjs

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function verifyAlumni() {
    console.log('🔧 Verifying alumni accounts...\n');

    try {
        // Update existing alumni users to be verified
        const { data, error } = await supabase
            .from('profiles')
            .update({ is_verified: true })
            .eq('role', 'alumni')
            .select('id, email, full_name, is_verified');

        if (error) {
            console.error('❌ Error:', error);
            process.exit(1);
        }

        console.log(`✅ Updated ${data.length} alumni account(s):\n`);
        data.forEach(profile => {
            console.log(`  • ${profile.email} (${profile.full_name}) - verified: ${profile.is_verified}`);
        });

        console.log('\n🎉 Done! Alumni users can now post jobs.');

    } catch (error) {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    }
}

verifyAlumni();
