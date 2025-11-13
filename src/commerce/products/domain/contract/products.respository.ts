import Product from '../models/products';
import { ProductResponseDTO } from '../../service/dto/ProductResponseDTO';
export interface ProductRepository {
    createProduct(product: Product): Promise<Product>;
    findById(id: number): Promise<Product | null>;
    update(product: Product): Promise<Product>;
    delete(id: number): Promise<void>;
    findAll(): Promise<Product[]>;
    findByCategoryName(categoryName: string): Promise<ProductResponseDTO[]>;
    findByVendorId(vendorId: string | number): Promise<Product[]>;
}
