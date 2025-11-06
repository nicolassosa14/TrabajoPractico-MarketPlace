import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import { CreateProductRequestDTO } from '../presentacion/dto/CreateProductRequest.dto';
import { UpdateProductDto } from './dto/UpdateProductRequest.dto';
import CreateProductCommandDTO from '../service/DTO/CreateProductCommand.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
  @Get()
  findAll(@Query('vendorName') vendorName?: string) {
    return this.productsService.findAll(vendorName);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
