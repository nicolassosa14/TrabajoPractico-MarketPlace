export interface ProductCategoryRepository {
    assignCategories(productId: number | string, categoryIds: number[]): Promise<void>;
    removeCategories(productId: number | string, categoryIds: number[]): Promise<void>;
    syncCategories(productId: number | string, categoryIds: number[]): Promise<void>;
    getCategoriesForProduct(productId: number | string): Promise<number[]>;
    getProductsForCategory(categoryId: number): Promise<(number|string)[]>;
}