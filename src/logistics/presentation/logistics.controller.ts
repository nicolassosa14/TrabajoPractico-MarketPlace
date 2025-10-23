import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogisticsService } from '../service/logistics.service';
import { CreateLogisticRequestDTO } from './dto/create-logistic.dto';
import { UpdateLogisticRequestDTO } from './dto/update-logistic.dto';

import { CreateLogisticCommand } from '../service/dto/create-logistic.dto';
import { UpdateLogisticCommand } from '../service/dto/update-logistic.dto';
import { UpdateStatusLogisticRequestDTO } from './dto/update-status.dto';
import { UpdateStatusLogisticCommand } from '../service/dto/update-status.dto';

@Controller('logistics')
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Post()
  create(@Body() dto: CreateLogisticRequestDTO) {
    if (!dto.is_available) {
      dto.is_available = true;
    }

    const command = new CreateLogisticCommand(dto.user_id, dto.vehicle_type, dto.license_plate, dto.is_available);
    return this.logisticsService.CreateLogistic(command);
  }

  @Get()
  findAll() {
    return this.logisticsService.findAllAvailable();
  }

  @Patch('status')
  UpdateStatus(@Body() dto: UpdateStatusLogisticRequestDTO ) {
    const command = new UpdateStatusLogisticCommand(dto.id, dto.user_id, dto.is_available);
    return this.logisticsService.UpdateStatus(command);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logisticsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogisticDto: UpdateLogisticRequestDTO) {
    return this.logisticsService.update(+id, updateLogisticDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logisticsService.remove(+id);
  }
}
