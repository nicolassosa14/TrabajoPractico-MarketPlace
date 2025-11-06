import Product from '../models/products';

export interface ProductRepository {
  createProduct(product: Product): Promise<Product>;
  findById(id: number): Promise<Product | null>;
  update(product: Product): Promise<Product>;
  delete(id: number): Promise<void>;
  findByVendorName(vendorname: string): Promise<Product[]>;
  assignCategories(productId: number, categoryIds: number[]): Promise<void>;
  findAll(): Promise<Product[]>;
}
