import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import { CreateProductRequestDTO } from '../presentacion/dto/CreateProductRequest.dto';
import { UpdateProductDto } from './dto/UpdateProductRequest.dto';
import CreateProductCommandDTO from '../service/dto/CreateProductCommand.dto';
import { find } from 'rxjs';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // POST /products
  @Post()

  create(@Body() dto: CreateProductRequestDTO) {
    const command = new CreateProductCommandDTO(
      dto.name,
      dto.description,
      dto.price,
      dto.image_url,
      dto.is_available ?? true,
      dto.vendor_id,
      dto.category_ids,
    );
    return this.productsService.createProduct(command);
  }

  // GET /products?vendorName=...
  @Get('bycategoria')
  findAllByVendor(@Query('vendorName') vendorName?: string, @Query('categories') category?: string) {
    if (category) {
      return this.productsService.findByCategoryName(category);
    }

  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }


  /*@Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }


  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }*/

  @Get('by-vendor/:vendorId')
  findByVendor(@Param('vendorId') vendorId: string) {
    return this.productsService.findByVendorId(vendorId);
  }
}
