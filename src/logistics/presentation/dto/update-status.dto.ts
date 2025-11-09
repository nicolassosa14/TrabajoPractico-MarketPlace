import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusLogisticRequestDTO {
  @IsString()
  @IsNotEmpty({ message: 'El id no puede estar vacío' })
  id: string;

  @IsString()
  @IsNotEmpty({ message: 'El user_id no puede estar vacío' })
  user_id: string;

  @IsNotEmpty({ message: 'El estado de disponibilidad no puede estar vacío' })
  @IsBoolean()
  is_available: boolean;
}
