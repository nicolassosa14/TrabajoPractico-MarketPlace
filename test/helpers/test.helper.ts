import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

/**
 * Helper para crear una aplicación de prueba completa
 */
export async function createTestingApp(
  moduleMetadata: any,
): Promise<INestApplication> {
  const moduleFixture: TestingModule =
    await Test.createTestingModule(moduleMetadata).compile();
  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}

/**
 * Helper para generar emails de prueba únicos
 */
export function generateTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test-${timestamp}-${random}@example.com`;
}

/**
 * Helper para generar UUIDs de prueba
 */
export function generateTestUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Helper para esperar un tiempo determinado (útil para tests async)
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Helper para limpiar base de datos de prueba
 */
export async function cleanTestDatabase(supabaseClient: any): Promise<void> {
  // Implementar según necesites
  // await supabaseClient.from('addresses').delete().neq('id', 0);
  // await supabaseClient.from('user_profiles').delete().neq('id', 0);
}

/**
 * Helper para validar estructura de respuesta de error
 */
export function expectErrorResponse(
  response: any,
  statusCode: number,
  messageContains?: string,
) {
  expect(response.status).toBe(statusCode);
  if (messageContains) {
    expect(response.body.message).toContain(messageContains);
  }
}

/**
 * Helper para validar estructura de respuesta exitosa
 */
export function expectSuccessResponse(response: any, statusCode = 200) {
  expect(response.status).toBe(statusCode);
  expect(response.body).toBeDefined();
}
