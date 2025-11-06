import User from '../models/user';

export interface UserRepository {
  createUser(user: User): Promise<any>;
  loginUser(user: User): Promise<any>;
  resendVerificationEmail(email: string): Promise<any>;
  VerificationStatus(email: string): Promise<any>;
  EditUserProfile(id: number, user: User): Promise<any>;
  delete(user_id: string): Promise<any>;
  updatePartialProfile(
    id: string,
    partialUser: Partial<{
      email?: string;
      first_name?: string;
      last_name?: string;
      phone_number?: string;
    }>,
  ): Promise<any>;
  findById(id: number): Promise<User | null>;
  addFavoriteVendor(user_id: string, vendor_id: string): Promise<any>;
  removeFavoriteVendor(user_id: string, vendor_id: string): Promise<any>;
  getUserProfile(user_id: string): Promise<any>;
}
