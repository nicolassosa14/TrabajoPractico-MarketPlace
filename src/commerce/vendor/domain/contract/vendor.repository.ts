import Vendor from '../models/vendor';
import UpdatePatchVendorCommand from 'src/commerce/vendor/service/DTO/UpdateVendorCommand.dto';
export interface VendorRepository {
    createVendor(vendor: Vendor): Promise<any>;
    update(vendor: Vendor): Promise<Vendor>;
    updatePartial(vendor: UpdatePatchVendorCommand): Promise<any>;
    findById(id: number): Promise<Vendor | null>;
    findByEmail(email: string): Promise<Vendor | null>;
    findAll(): Promise<Vendor[]>;
}
