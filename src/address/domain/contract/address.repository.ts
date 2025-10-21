
import Address  from '../models/address';

export interface AddressRepository {
    createAddress(Address): Promise<any>;
    findAllAddressByUserID(user_id:string): Promise<Address[]>;
    EditAdressByID(id:string,address:Address): Promise<any>;
}


