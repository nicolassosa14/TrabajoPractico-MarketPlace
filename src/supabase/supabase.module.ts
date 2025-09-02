import {Module } from '@nestjs/common';
import {createClient} from '@supabase/supabase-js'

const SupabaseProvider = {
    provide: 'SUPABASE_CLIENT',
    useFactory: () => {
        const supabaseUrl = ''
        const supabaseKey = ''
        return createClient(supabaseUrl, supabaseKey)
    }
};

@Module({
    providers:[SupabaseProvider],
    exports:['SUPABASE_CLIENT']
})
export class SupabaseModule{}