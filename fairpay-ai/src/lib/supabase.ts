import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key-placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ProjectRecord {
    id: string;
    title: string;
    client: string;
    amount: number;
    escrowStatus: 'active' | 'in_escrow' | 'pending' | 'released' | 'disputed';
    currentMilestone: string;
    progressPercent: number;
    dueDate: string;
    createdAt: string;
}
