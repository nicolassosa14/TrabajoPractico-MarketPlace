import { Module } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
const SupabaseProvider = {
  provide: 'SUPABASE_CLIENT',
  //ANTERIOR
  // useFactory: () => {
  //   const supabaseUrl = 'https://fcdvvaygoclixkfiolfd.supabase.co';
  //   const supabaseKey =
  //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZHZ2YXlnb2NsaXhrZmlvbGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNjgzNjMsImV4cCI6MjA3MTc0NDM2M30.7WPAXzA8WxkxfHSX-ckZajk7UsLkFrBwa8OhpOSt4TQ';
  //   return createClient(supabaseUrl, supabaseKey);
  // },
  useFactory: () => {
    const supabaseUrl = 'https://nxilakpwsjqgerrviayg.supabase.co';
    const supabaseKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54aWxha3B3c2pxZ2VycnZpYXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3OTg2MjEsImV4cCI6MjA3NTM3NDYyMX0.11PBt88_bzFOwJHZPTzbGfVfeglkfaHLQM9iuOsPDbM';
    return createClient(supabaseUrl, supabaseKey);
  },
};

@Module({
  providers: [SupabaseProvider],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule {}
