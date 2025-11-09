import Admin from '../model/admin';

export interface AdminRepository {
  createUser(admin: Admin): Promise<any>;
  findAllByRole(role: string): Promise<any[]>;
  updateUser(admin: Admin): Promise<any>;
  deleteUser(id: string): Promise<any>; 
}
