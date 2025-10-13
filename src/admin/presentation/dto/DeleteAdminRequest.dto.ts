import { IsString, IsNotEmpty } from 'class-validator';

export default class DeleteAdminRequestDTO {
  @IsString()
  @IsNotEmpty()
  id: string; 
}
