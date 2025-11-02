import { Injectable, Inject } from '@nestjs/common';
import CreateCategoriesCommand from '../service/DTO/CreateCategoriesCommand.dto';
import  UpdateCategoryDto  from '../service/DTO/UpdateCategoriesCommand.dto';
import type {CategoryRepository} from '../domain/contract/categories.repository'
import categories from '../domain/models/categories';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CategoryRepository') private readonly categoriesRepository : CategoryRepository

  ){}

  async createCategory(dto: CreateCategoriesCommand) {
    const categoria = new categories(
      dto.name,
      dto.description,
      dto.user_id,
    )
    return this.categoriesRepository.createcategories(categoria)
  }

  async findAll(name?: string) {
    return this.categoriesRepository.findAll(name);
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
