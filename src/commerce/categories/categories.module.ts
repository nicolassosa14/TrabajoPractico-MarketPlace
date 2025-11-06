import { Module } from '@nestjs/common';
import { CategoriesService } from './service/categories.service';
import { CategoriesController } from '../categories/presentacion/categories.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { SupabaseCategoryRepository } from './infrastructure/repository/supabase.categories.repository';

@Module({
  imports: [SupabaseModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: 'CategoryRepository',
      useClass: SupabaseCategoryRepository,
    },
  ],
})
export class CategoriesModule {}
