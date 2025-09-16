import User from '../modelos/user';

export interface UserRepository {
  save(data: User): Promise<void>;
  delete(id:number): Promise<void>;
}

