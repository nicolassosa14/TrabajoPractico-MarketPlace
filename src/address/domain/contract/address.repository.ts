
import Address  from '../models/address';

export interface AddressRepository {
    createAddress(Address): Promise<any>;
    findAllAddresssByUserID(): Promise<Address[]>;
    EditAdressByID(id: string, street_address: string, city: string, postal_code: string, details: string): Promise<any>;
}


