import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  MaxLength,
} from 'class-validator';

export default class UpdateAddressRequestDTO {
  @IsUUID('4', { message: 'El user_id debe ser un UUID válido.' })
  @IsNotEmpty({ message: 'El user_id es obligatorio.' })
  user_id: string;

  @IsString()
  @MaxLength(255, {
    message: 'La direccion no puede exceder los 255 caracteres.',
  })
  @IsOptional()
  street_address?: string;

  @IsString()
  @MaxLength(100, { message: 'La ciudad no puede exceder los 100 caracteres.' })
  @IsOptional()
  city?: string;

  @IsString()
  @MaxLength(20, {
    message: 'El codigo postal no puede exceder los 20 caracteres.',
  })
  @IsOptional()
  postal_code?: string;
  @IsUUID('4', { message: 'El id debe ser un UUID válido.' })
  @IsNotEmpty({ message: 'El id es obligatorio.' })
  id: string;

  @IsString()
  @IsOptional()
  details?: string;
}
