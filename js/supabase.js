// js/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://lcmrtrtcorbjofukogkd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZpDPnLc4DZfUP7QQqIWk7A_1KLdbI4S';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);