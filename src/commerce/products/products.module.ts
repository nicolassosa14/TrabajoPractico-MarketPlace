import { Module } from '@nestjs/common';
import { ProductsService } from './service/products.service';
import { ProductsController } from './presentacion/products.controller';
import { SupabaseProductRepository } from './infrastructure/repository/supabase.products.repository';
import { SupabaseModule } from '../../supabase/supabase.module';
import { ProductCategoryRepository } from '../product_category/contract/Product_category.repository';
import { SupabaseProductCategoryRepository } from '../product_category/infrastructure/repository/supabase.product_vendor.repository';

@Module({
  imports: [SupabaseModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    { provide: 'ProductRepository', useClass: SupabaseProductRepository },
    {
      provide: 'ProductCategoryRepository',
      useClass: SupabaseProductCategoryRepository,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
