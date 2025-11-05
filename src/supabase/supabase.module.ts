import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SupabaseProvider = {
  provide: 'SUPABASE_CLIENT',
  useFactory: (configService: ConfigService): SupabaseClient => {
    const supabaseUrl = configService.get<string>('SUPABASE_URL');
    const supabaseKey = configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in environment');
    }

    return createClient(supabaseUrl, supabaseKey);
  },
  inject: [ConfigService],
};

@Module({
  providers: [SupabaseProvider],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule {}
