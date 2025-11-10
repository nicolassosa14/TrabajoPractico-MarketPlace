import { IsNotEmpty, IsUUID } from 'class-validator';

export default class DeleteAddressRequestDTO {
  @IsUUID('4', { message: 'El user_id debe ser un UUID válido.' })
  @IsNotEmpty({ message: 'El user_id es obligatorio.' })
  user_id: string;

  @IsUUID('4', { message: 'El id debe ser un UUID válido.' })
  @IsNotEmpty({ message: 'El id es obligatorio.' })
  id: string;
}
