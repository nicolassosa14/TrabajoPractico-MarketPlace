/*import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { OrdersModule } from '../orders.module';

describe('OrdersModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrdersModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // 🔹 Activamos validaciones globales (si las usás en main.ts)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // 🔹 TEST 1: Obtener todas las órdenes
  it('GET /orders → debería devolver un array de órdenes', async () => {
    const res = await request(app.getHttpServer())
      .get('/orders')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  // 🔹 TEST 2: Crear una orden nueva
  it('POST /orders → debería crear una nueva orden', async () => {
    const mockOrder = {
      user_id: 'user123',
      vendor_id: 'vendor123',
      subtotal: 100.0,
      delivery_fee: 10.0,
      discount_applied: 0.0,
      taxes: 21.0,
      total_amount: 131.0,
      status: 'pending',
    };

    const res = await request(app.getHttpServer())
      .post('/orders')
      .send(mockOrder)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('pending');
    expect(res.body.user_id).toBe('user123');
  });

  // 🔹 TEST 3: Validación de datos incorrectos
  it('POST /orders → debería fallar si faltan campos requeridos', async () => {
    const invalidOrder = {
      user_id: 'user123',
      subtotal: 50.0,
    };

    const res = await request(app.getHttpServer())
      .post('/orders')
      .send(invalidOrder)
      .expect(400);

    expect(res.body.message).toBeDefined();
  });
});*/
