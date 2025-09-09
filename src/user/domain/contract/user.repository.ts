import User from "../modelos/user";

export interface UserRepository {
    save(data: User): Promise<void>;
}