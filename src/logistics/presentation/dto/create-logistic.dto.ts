import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateLogisticRequestDTO {
  @IsString()
  @IsNotEmpty({ message: 'user_id is required' })
  user_id: string;
  @IsString()
  @IsNotEmpty({ message: 'vehicle_type is required' })
  vehicle_type: string;
  @IsString()
  @IsNotEmpty({ message: 'license_plate is required' })
  license_plate: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'is_available is required' })
  is_available: boolean;
}
