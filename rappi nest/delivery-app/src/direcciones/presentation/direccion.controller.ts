import { Controller, Post, Body, Get, Param, Patch, Delete, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { DireccionService } from '../service/direccion.service';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { UpdateDireccionDto } from './dto/update-direccion.dto';
import { JwtAuthGuard } from '../../login/strategy/jwt-auth.guard';
import { RolesGuard } from '../../login/decorators/roles.guard';
import { Roles } from '../../login/decorators/roles.decorator';
import type { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: { userId: number; role: string };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENT')
@Controller('direcciones')
export class DireccionController {
  constructor(private readonly service: DireccionService) {}

  @Post()
  create(@Body() dto: CreateDireccionDto, @Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.service.createForUser(dto, userId);
  }

  @Get()
  getAll(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.service.getAllByUsuario(userId);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.service.getOneForUser(id, userId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDireccionDto, @Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.service.updateForUser(id, dto, userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.service.removeForUser(id, userId);
  }
}
