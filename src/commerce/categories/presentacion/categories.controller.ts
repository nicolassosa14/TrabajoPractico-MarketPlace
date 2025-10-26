import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoriesService } from '../service/categories.service';
import { CreateCategoryRequestDto } from './dto/CrearCategoriaRequest.dto';
import { UpdateCategoryRequestDto } from './dto/UpdateCategoryRequest.dto';
import UpdateCategoryCommand from '../service/DTO/UpdateCategoriesCommand.dto';
import CreateCategoriesCommand from '../service/DTO/CreateCategoriesCommand.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() dto: CreateCategoryRequestDto) {
    const command = new CreateCategoriesCommand(
      dto.name,
      dto.description,
    )
    return this.categoriesService.createCategory(command);
  }

  @Get()
  findAll(@Query('name') name?:string) {
    return this.categoriesService.findAll(name);
  }

  @Patch(':id')
    async updateCategories(
        @Param('id') id: number,
        @Body() dto: UpdateCategoryRequestDto
    ) {
        const command = new UpdateCategoryCommand(
          id, dto.name, dto.description);
        return this.categoriesService.update(id, command
        )
    }

}
