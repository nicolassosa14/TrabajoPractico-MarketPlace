import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateDireccionDto } from '../presentation/dto/create-direccion.dto';
import { UpdateDireccionDto } from '../presentation/dto/update-direccion.dto';

describe('CreateDireccionDto', () => {
  it('debe validar correctamente con todos los campos requeridos', async () => {
    const dto = plainToClass(CreateDireccionDto, {
      usuario_id: 1,
      calle: 'Av. Corrientes',
      altura: 1234,
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('debe validar correctamente con campos opcionales', async () => {
    const dto = plainToClass(CreateDireccionDto, {
      usuario_id: 1,
      calle: 'Av. Corrientes',
      altura: 1234,
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      latitud: -34.6037,
      longitud: -58.3816,
      instrucciones_entrega: 'Timbre A',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  describe('Validaciones de campos requeridos', () => {
    it('debe fallar si falta usuario_id', async () => {
      const dto = plainToClass(CreateDireccionDto, {
        calle: 'Av. Corrientes',
        altura: 1234,
        ciudad: 'Buenos Aires',
        provincia: 'CABA',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('usuario_id');
    });

    it('debe fallar si falta calle', async () => {
      const dto = plainToClass(CreateDireccionDto, {
        usuario_id: 1,
        altura: 1234,
        ciudad: 'Buenos Aires',
        provincia: 'CABA',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const calleError = errors.find((e) => e.property === 'calle');
      expect(calleError).toBeDefined();
    });

    it('debe fallar si falta altura', async () => {
      const dto = plainToClass(CreateDireccionDto, {
        usuario_id: 1,
        calle: 'Av. Corrientes',
        ciudad: 'Buenos Aires',
        provincia: 'CABA',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const alturaError = errors.find((e) => e.property === 'altura');
      expect(alturaError).toBeDefined();
    });

    it('debe fallar si falta ciudad', async () => {
      const dto = plainToClass(CreateDireccionDto, {
        usuario_id: 1,
        calle: 'Av. Corrientes',
        altura: 1234,
        provincia: 'CABA',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const ciudadError = errors.find((e) => e.property === 'ciudad');
      expect(ciudadError).toBeDefined();
    });

    it('debe fallar si falta provincia', async () => {
      const dto = plainToClass(CreateDireccionDto, {
        usuario_id: 1,
        calle: 'Av. Corrientes',
        altura: 1234,
        ciudad: 'Buenos Aires',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const provinciaError = errors.find((e) => e.property === 'provincia');
      expect(provinciaError).toBeDefined();
    });
  });

  describe('Validaciones de tipos', () => {
    it('debe fallar si usuario_id no es un número', async () => {
      const dto = plainToClass(CreateDireccionDto, {
        usuario_id: 'not-a-number',
        calle: 'Av. Corrientes',
        altura: 1234,
        ciudad: 'Buenos Aires',
        provincia: 'CABA',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const userIdError = errors.find((e) => e.property === 'usuario_id');
      expect(userIdError).toBeDefined();
    });

    it('debe fallar si calle no es un string', async () => {
      const dto = plainToClass(CreateDireccionDto, {
        usuario_id: 1,
        calle: 12345,
        altura: 1234,
        ciudad: 'Buenos Aires',
        provincia: 'CABA',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const calleError = errors.find((e) => e.property === 'calle');
      expect(calleError).toBeDefined();
    });

    it('debe fallar si altura no es un número', async () => {
      const dto = plainToClass(CreateDireccionDto, {
        usuario_id: 1,
        calle: 'Av. Corrientes',
        altura: 'mil doscientos',
        ciudad: 'Buenos Aires',
        provincia: 'CABA',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const alturaError = errors.find((e) => e.property === 'altura');
      expect(alturaError).toBeDefined();
    });

    it('debe fallar si latitud no es un número', async () => {
      const dto = plainToClass(CreateDireccionDto, {
        usuario_id: 1,
        calle: 'Av. Corrientes',
        altura: 1234,
        ciudad: 'Buenos Aires',
        provincia: 'CABA',
        latitud: 'not-a-number',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const latitudError = errors.find((e) => e.property === 'latitud');
      expect(latitudError).toBeDefined();
    });

    it('debe fallar si longitud no es un número', async () => {
      const dto = plainToClass(CreateDireccionDto, {
        usuario_id: 1,
        calle: 'Av. Corrientes',
        altura: 1234,
        ciudad: 'Buenos Aires',
        provincia: 'CABA',
        longitud: 'not-a-number',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const longitudError = errors.find((e) => e.property === 'longitud');
      expect(longitudError).toBeDefined();
    });
  });

  describe('Validaciones de campos vacíos', () => {
    it('debe fallar con strings vacíos en campos requeridos', async () => {
      const dto = plainToClass(CreateDireccionDto, {
        usuario_id: 1,
        calle: '',
        altura: 1234,
        ciudad: '',
        provincia: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});

describe('UpdateDireccionDto', () => {
  it('debe validar correctamente con todos los campos', async () => {
    const dto = plainToClass(UpdateDireccionDto, {
      calle: 'Nueva Calle',
      altura: 5678,
      ciudad: 'Córdoba',
      provincia: 'Córdoba',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('debe validar correctamente con solo algunos campos', async () => {
    const dto = plainToClass(UpdateDireccionDto, {
      calle: 'Nueva Calle',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('debe validar correctamente con campos opcionales', async () => {
    const dto = plainToClass(UpdateDireccionDto, {
      instrucciones_entrega: 'Nueva instrucción',
      latitud: -31.4201,
      longitud: -64.1888,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('debe validar correctamente sin ningún campo (DTO vacío)', async () => {
    const dto = plainToClass(UpdateDireccionDto, {});

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('debe fallar con tipos incorrectos', async () => {
    const dto = plainToClass(UpdateDireccionDto, {
      altura: 'no-es-numero',
      latitud: 'no-es-numero',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('debe heredar validaciones de CreateDireccionDto', async () => {
    const dto = plainToClass(UpdateDireccionDto, {
      usuario_id: 'not-a-number',
      calle: 12345,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});