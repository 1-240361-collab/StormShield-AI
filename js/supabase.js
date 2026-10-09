// js/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ⚠️ REPLACE THESE WITH YOUR ACTUAL VALUES FROM SUPABASE DASHBOARD
const SUPABASE_URL = 'https://lcmrtrtcorbjofukogkd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjbXJ0cnRjb3Jiam9mdWtvZ2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1MjI5NjQsImV4cCI6MjEwNzA5ODk2NH0.w6-o5yl2HQCioFJq0w1FxL82cPqSjGnM6lbsTVAol38';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

