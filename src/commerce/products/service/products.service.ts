import { Inject, Injectable } from '@nestjs/common';
import CreateProductCommandDTO from '../service/DTO/CreateProductCommand.dto';
import { UpdateProductDto } from '../presentacion/dto/UpdateProductRequest.dto';
import Product from '../domain/models/products';
import { dot } from 'node:test/reporters';
import type { ProductRepository } from '../domain/contract/products.respository';
import { NotFoundException } from '@nestjs/common';
import type { ProductCategoryRepository } from 'src/commerce/product_category/contract/Product_category.repository';
@Injectable()

export class ProductsService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('ProductCategoryRepository')
    private readonly productCategoryRepository: ProductCategoryRepository,
  ) { }

  async createProduct(dto: CreateProductCommandDTO) {
    const product = new Product(
      dto.getName(),
      dto.getDescription(),
      dto.getImageUrl(),
      dto.getPrice(),
      dto.getIsAvailable(),
      dto.getVendorId(),
    );
    const createdProduct = await this.productRepository.createProduct(product);


    /* const productId = createdProduct.getId();
     const categoryIds = dto.getCategoryIds();
 
     if (productId && categoryIds && categoryIds.length > 0) {
       await this.productRepository.assignCategories(productId, categoryIds);
     }*/

    return createdProduct;
  }

  findAll(vendorName?: string) {
    if (vendorName) {
      return this.productRepository.findByVendorName(vendorName);
    }
    return this.productRepository.findAll();
  }

  async findOne(id: number) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.findOne(id); // Asegura que el producto existe y obtiene sus datos

    const productToUpdate = new Product(
      updateProductDto.name ?? existingProduct.getName(),
      updateProductDto.description ?? existingProduct.getDescription(),
      updateProductDto.image_url ?? existingProduct.getImageUrl(),
      updateProductDto.price ?? existingProduct.getPrice(),
      updateProductDto.is_available ?? existingProduct.getIsAvailable(),
      existingProduct.getVendorId(),
      id,
    );

    const updatedProduct = await this.productRepository.update(productToUpdate);
    if (updateProductDto.category_ids) {
      await this.productRepository.assignCategories(id, updateProductDto.category_ids);
    }
    return updatedProduct;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.productRepository.delete(id);
    return { message: 'Product eliminado' };
  }

  async createProductAndAssignCategories(product: Product, categoryIds: number[]) {
    const created = await this.productRepository.createProduct(product);
    const productId = (created as any).id ?? (created as any).getId?.();
    if (categoryIds && categoryIds.length > 0) {
      await this.productCategoryRepository.assignCategories(productId, categoryIds);
    }
    return created;
  }

  async updateProductCategories(productId: number | string, categoryIds: number[]) {
    await this.productCategoryRepository.syncCategories(productId, categoryIds);
  }

  async getCategoriesForProduct(productId: number | string) {
    return this.productCategoryRepository.getCategoriesForProduct(productId);
  }

  async getProductsForCategory(categoryId: number) {
    return this.productCategoryRepository.getProductsForCategory(categoryId);
  }
}
