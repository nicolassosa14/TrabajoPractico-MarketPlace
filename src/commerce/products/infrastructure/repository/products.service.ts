import { Inject, Injectable } from '@nestjs/common';
import CreateProductCommandDTO from '../../service/dto/CreateProductCommand.dto';
import { UpdateProductDto } from '../../presentacion/dto/UpdateProductRequest.dto';
import Product from '../../domain/models/products';
import { dot } from 'node:test/reporters';
import type { ProductRepository } from '../../domain/contract/products.respository';
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
      dto.getCategoryIds(),
    );
    const createdProduct = await this.productRepository.createProduct(product);


    return createdProduct;
  }

  async findAll() {
    return this.productRepository.findAll();
  }

  

  async findOne(id: number) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async findByCategoryName(categoryName: string) {
    return this.productRepository.findByCategoryName(categoryName);
  }


  async update(id: number, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.findOne(id); 

    const productToUpdate = new Product(
      updateProductDto.name ?? existingProduct.getName(),
      updateProductDto.description ?? existingProduct.getDescription(),
      updateProductDto.image_url ?? existingProduct.getImageUrl(),
      updateProductDto.price ?? existingProduct.getPrice(),
      updateProductDto.is_available ?? existingProduct.getIsAvailable(),
      existingProduct.getVendorId()!,
      updateProductDto.category_ids ?? existingProduct.getCategoryIds()!,
      existingProduct.getVendorName(),
      id,
    );

    const updatedProduct = await this.productRepository.update(productToUpdate);

    // Actualizar categorías si se proporcionan
    if (updateProductDto.category_ids) {
      await this.updateProductCategories(id, updateProductDto.category_ids);
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

  async findByVendorId(vendorId: string) {
    return this.productRepository.findByVendorId(vendorId);
  }

}
