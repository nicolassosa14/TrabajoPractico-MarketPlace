import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { LogisticRepository } from 'src/logistics/domain/contract/logistic.repository';
import Logistic from '../domain/models/logistic';

@Injectable()
export class SupabaseLogisticRepository implements LogisticRepository {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabaseClient: SupabaseClient,
  ) {}

  async createLogistic(logistic: Logistic) {
    const verifyExistLogistic = await this.VerifyExistLogisticForUserID(
      logistic.getUser_id(),
      logistic.getLicense_plate(),
    );

    if (verifyExistLogistic) {
      throw new BadRequestException('Ya existe este logistic para este driver');
    }
    const VerifyRol = await this.VerifyUserIdDriver(logistic.getUser_id());
    if (!VerifyRol || VerifyRol.length === 0) {
      throw new BadRequestException('Usuario no encontrado');
    }
    if (VerifyRol[0].role !== 'driver') {
      throw new BadRequestException('Este usuario no es un driver');
    }

    const { data, error } = await this.supabaseClient
      .from('drivers_details')
      .insert([
        {
          user_id: logistic.getUser_id(),
          vehicle_type: logistic.getVehicle_type(),
          license_plate: logistic.getLicense_plate(),
          is_available: logistic.getIs_available(),
        },
      ]);
    if (error)
      throw new BadRequestException(
        'Error al crear el logistic: ' + error.message,
      );
    return 'Logistic creado con éxito ';
  }
  // Verifica si ya existe un logistic para el user_id dado
  async VerifyExistLogisticForUserID(
    user_id: string,
    license_plate: string,
  ): Promise<boolean> {
    const { data, error } = await this.supabaseClient
      .from('drivers_details')
      .select('*')
      .eq('user_id', user_id)
      .eq('license_plate', license_plate);
    if (error)
      throw new BadRequestException(
        'Error al verificar el logistic: ' + error.message,
      );
    return data && data.length > 0;
  }
  // Verifica si el user_id corresponde a un driver
  async VerifyUserIdDriver(user_id: string): Promise<any> {
    const { data, error } = await this.supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('user_id', user_id);
    if (error)
      throw new BadRequestException(
        'Error al verificar el driver: ' + error.message,
      );
    return data;
  }
  async findAllAvailableLogistics(): Promise<Logistic[]> {
    const { data, error } = await this.supabaseClient
      .from('drivers_details')
      .select('*')
      .eq('is_available', true);
    if (error)
      throw new BadRequestException(
        'Error al obtener los logistics: ' + error.message,
      );
    if (data.length === 0) {
      throw new BadRequestException('No hay logistics disponibles');
    }
    return data;
  }

  async UpdateStatusLogisticByID(
    id: string,
    user_id: string,
    is_available: boolean,
  ): Promise<any> {
    const { data, error } = await this.supabaseClient
      .from('drivers_details')
      .update({ is_available: is_available })
      .eq('id', id)
      .eq('user_id', user_id);
    if (error)
      throw new BadRequestException(
        'Error al actualizar el estado del logistic: ' + error.message,
      );
    return 'Estado del logistic actualizado con éxito ';
  }

  async findAllLogisticByUserID(user_id: string): Promise<Logistic[]> {
    const { data, error } = await this.supabaseClient
      .from('drivers_details')
      .select('*')
      .eq('user_id', user_id);
    if (error)
      throw new BadRequestException(
        'Error al obtener los logistics del usuario: ' + error.message,
      );
    return data;
  }

  async findLogisticByID(id: string): Promise<Logistic> {
    // Lógica para obtener un logistic por ID desde Supabase
    const { data, error } = await this.supabaseClient
      .from('drivers_details')
      .select('*')
      .eq('id', id)
      .single();
    if (error)
      throw new BadRequestException(
        'Error al obtener el logistic: ' + error.message,
      );
    return data;
  }

  async updateLogisticByID(id: string, logistic: Logistic): Promise<any> {
    // Lógica para actualizar un logistic por ID en Supabase
    return 'Logistic actualizado con éxito ';
  }
}
