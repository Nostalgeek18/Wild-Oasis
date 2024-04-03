
import { createClient } from '@supabase/supabase-js'
export const supabaseUrl = 'https://jpxvjpjcywqtruzdltvh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpweHZqcGpjeXdxdHJ1emRsdHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA1MjM1NzAsImV4cCI6MjAyNjA5OTU3MH0.40_QYJJLjU66tm8RpOvU3MUEo8PWOmY0XFQi9AFq9j4'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;