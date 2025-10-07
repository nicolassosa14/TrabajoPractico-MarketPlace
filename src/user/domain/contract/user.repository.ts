
import User  from '../modelos/user';

export interface UserRepository {
  createUser(user:User) : Promise<any>;
  loginUser(user:User) : Promise<any>;
  resendVerificationEmail(email:string) : Promise<any>;
  EditUserProfile(id:number,user:User) :Promise<any>;
  delete(id: number): Promise<any>;         
  updateUser(user: User): Promise<User>; 

  updatePartial(id: string, partialUser: Partial<{
        email?: string;
        first_name?: string;
        last_name?: string;
        phone_number?: number;
      }>): Promise<any>;  
  findById(id: number): Promise<User | null>; 
}


