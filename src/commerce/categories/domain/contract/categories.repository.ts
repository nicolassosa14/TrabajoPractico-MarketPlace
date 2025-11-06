import Categories from '../models/categories';

export interface CategoryRepository {
  createcategories(categories: Categories): Promise<any>;
  updateCategories(categories: Categories): Promise<any>;
  findAll(name?: string): Promise<Categories[]>;
}
