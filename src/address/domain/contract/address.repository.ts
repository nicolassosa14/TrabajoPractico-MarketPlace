
import Address  from '../models/address';

export interface AddressRepository {
    createAddress(Address): Promise<any>;
    findAllAddressByUserID(user_id:string): Promise<Address[]>;
    EditAdressByID(address:Address): Promise<any>;
    deleteAddress(user_id:string, id:string): Promise<any>;
}


