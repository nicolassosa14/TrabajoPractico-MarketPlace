import { Inject, Injectable } from '@nestjs/common';
import { CreateLogisticCommand } from './dto/create-logistic.dto';
import { UpdateLogisticCommand } from './dto/update-logistic.dto';
import type { LogisticRepository } from '../domain/contract/logistic.repository';
import Logistic from '../domain/models/logistic';
import { UpdateStatusLogisticCommand } from './dto/update-status.dto';

@Injectable()
export class LogisticsService {
  constructor(
      @Inject('LogisticRepository') private readonly logisticRepository: LogisticRepository,
    ) {}

  CreateLogistic(createLogisticDto: CreateLogisticCommand) {

    const logistic = new Logistic(
      createLogisticDto.getUser_id(),
      createLogisticDto.getVehicle_type(),
      createLogisticDto.getLicense_plate(),
      createLogisticDto.getIs_available()
    );

    return this.logisticRepository.createLogistic(logistic);
  }

  findAllAvailable() {
    return this.logisticRepository.findAllAvailableLogistics();
  }

  UpdateStatus(updateStatusLogisticDto: UpdateStatusLogisticCommand) {
    return this.logisticRepository.UpdateStatusLogisticByID(updateStatusLogisticDto.getId(), updateStatusLogisticDto.getUser_id(), updateStatusLogisticDto.getIs_available());
  }

  findOne(id: number) {
    return `This action returns a #${id} logistic`;
  }

  update(id: number, updateLogisticDto: UpdateLogisticCommand) {
    return `This action updates a #${id} logistic`;
  }

  remove(id: number) {
    return `This action removes a #${id} logistic`;
  }
}
