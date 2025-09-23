
import User  from '../modelos/user';

export interface UserRepository {
  createUser(user:User) : Promise<any>;
  loginUser(user:User) : Promise<any>;
  resendVerificationEmail(email:string) : Promise<any>;
  delete(id: number): Promise<any>;         
  updateUser(user: User): Promise<User>;     
  updatePartial(user: User): Promise<any>;  
  findById(id: number): Promise<User | null>; 
}


