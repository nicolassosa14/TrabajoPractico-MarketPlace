/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Preset para TypeScript
  preset: 'ts-jest',

  // Entorno de Node.js
  testEnvironment: 'node',

  // Extensiones de archivos a reconocer
  moduleFileExtensions: ['js', 'json', 'ts'],

  // Expresion regular para tests
  testRegex: '.*\\.spec\\.ts$',

  // Transformación de TS a JS
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  // Cobertura
  collectCoverage: true,
  coverageDirectory: './coverage',

  // 🚀 Clave: la raíz del proyecto
  rootDir: './', // siempre la raíz donde está package.json

  // 🔑 Alias src/* mapeado correctamente
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  // Opciones globales de ts-jest
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // usa tu tsconfig principal
      isolatedModules: true,
    },
  },

  // Ignorar node_modules
  transformIgnorePatterns: ['<rootDir>/node_modules/'],

  // Opcional: aumentar timeout para tests de integración largos
  testTimeout: 20000,
};
