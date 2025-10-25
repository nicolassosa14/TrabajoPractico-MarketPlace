import Address from '../../src/address/domain/models/address';
import CreateAddressCommand from '../../src/address/service/dto/CreateAddress.dto';

/**
 * Fixtures para tests del módulo Address
 */

export const validAddressData = {
  user_id: '123e4567-e89b-12d3-a456-426614174000',
  street_address: '123 Main Street',
  city: 'Springfield',
  postal_code: '12345',
  details: 'Apartment 4B, Ring doorbell twice',
};

export const validAddressData2 = {
  user_id: '123e4567-e89b-12d3-a456-426614174000',
  street_address: '456 Oak Avenue',
  city: 'Shelbyville',
  postal_code: '67890',
  details: 'House with blue door',
};

export const validAddressDataWithoutDetails = {
  user_id: '123e4567-e89b-12d3-a456-426614174000',
  street_address: '789 Elm Street',
  city: 'Capital City',
  postal_code: '54321',
};

export const invalidAddressDataMissingUserId = {
  user_id: '',
  street_address: '123 Main Street',
  city: 'Springfield',
  postal_code: '12345',
};

export const invalidAddressDataMissingStreet = {
  user_id: '123e4567-e89b-12d3-a456-426614174000',
  street_address: '',
  city: 'Springfield',
  postal_code: '12345',
};

export const createValidAddress = (): Address => {
  return new Address(
    validAddressData.user_id,
    validAddressData.street_address,
    validAddressData.city,
    validAddressData.postal_code,
    validAddressData.details,
  );
};

export const createValidAddressCommand = (): CreateAddressCommand => {
  return new CreateAddressCommand(
    validAddressData.user_id,
    validAddressData.street_address,
    validAddressData.city,
    validAddressData.postal_code,
    validAddressData.details,
  );
};

export const mockAddressRecord = {
  id: 1,
  user_id: validAddressData.user_id,
  street_address: validAddressData.street_address,
  city: validAddressData.city,
  postal_code: validAddressData.postal_code,
  details: validAddressData.details,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockAddressRecord2 = {
  id: 2,
  user_id: validAddressData2.user_id,
  street_address: validAddressData2.street_address,
  city: validAddressData2.city,
  postal_code: validAddressData2.postal_code,
  details: validAddressData2.details,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockAddressList = [mockAddressRecord, mockAddressRecord2];
