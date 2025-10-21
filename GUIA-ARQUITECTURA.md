# 📚 Guía Completa de Arquitectura del Marketplace

## Tabla de Contenidos
1. [Introducción al Proyecto](#1-introducción-al-proyecto)
2. [Arquitectura Limpia (Clean Architecture)](#2-arquitectura-limpia-clean-architecture)
3. [Arquitectura Modular](#3-arquitectura-modular)
4. [Análisis Capa por Capa](#4-análisis-capa-por-capa)
5. [Patrones de Diseño Implementados](#5-patrones-de-diseño-implementados)
6. [Principios SOLID Aplicados](#6-principios-solid-aplicados)
7. [Flujo Completo de una Request](#7-flujo-completo-de-una-request)
8. [Estructura de Directorios](#8-estructura-de-directorios)
9. [Configuración y Módulos Compartidos](#9-configuración-y-módulos-compartidos)
10. [Glosario de Términos](#10-glosario-de-términos)

---

## 1. Introducción al Proyecto

### ¿Qué es este proyecto?
Este es un **Marketplace** (mercado digital) construido con tecnologías modernas que permite:
- Gestionar usuarios y sus perfiles
- Manejar direcciones de envío
- Administrar comercios y vendedores
- Procesar pedidos y pagos
- Gestionar logística

### Tecnologías Principales

#### **NestJS** 🐱
Framework de Node.js para construir aplicaciones del lado del servidor. Es como Angular pero para el backend.

**Características:**
- Basado en TypeScript
- Arquitectura modular
- Inyección de dependencias nativa
- Decoradores para rutas y servicios

#### **Supabase** 🔥
Backend as a Service (BaaS) que proporciona:
- Base de datos PostgreSQL
- Autenticación integrada
- Storage para archivos
- APIs automáticas

#### **TypeScript** 📘
JavaScript con tipos estáticos que previene errores y mejora la documentación del código.

---

## 2. Arquitectura Limpia (Clean Architecture)

### ¿Qué es Clean Architecture?

Es una forma de organizar el código en capas concéntricas donde **las capas internas NO conocen a las externas**.

```
┌─────────────────────────────────────────┐
│        PRESENTACIÓN (Controllers)       │  ← Capa más externa
├─────────────────────────────────────────┤
│         APLICACIÓN (Services)           │
├─────────────────────────────────────────┤
│      INFRAESTRUCTURA (Repositories)     │
├─────────────────────────────────────────┤
│         DOMINIO (Models/Entities)       │  ← Núcleo del negocio
└─────────────────────────────────────────┘
```

### Analogía del Mundo Real

Imagina una empresa:

1. **DOMINIO** = Las reglas de negocio (políticas de la empresa)
2. **APLICACIÓN** = Los procesos internos (cómo se hace el trabajo)
3. **INFRAESTRUCTURA** = Las herramientas y sistemas (computadoras, bases de datos)
4. **PRESENTACIÓN** = La atención al cliente (cómo se comunica con el exterior)

### Las 4 Capas Explicadas

#### 🟢 1. Capa de Dominio (Domain Layer)
**Propósito:** Contiene la lógica de negocio pura y las reglas del dominio.

**Características:**
- NO depende de frameworks
- NO depende de bases de datos
- NO depende de APIs externas
- Contiene las entidades/modelos del negocio

**Archivos en el proyecto:**
- `src/user/domain/models/user.ts`
- `src/address/domain/models/address.ts`
- `src/user/domain/contract/user.repository.ts` (interfaces)

#### 🔵 2. Capa de Aplicación (Application/Service Layer)
**Propósito:** Orquesta el flujo de datos y coordina las operaciones.

**Características:**
- Usa las entidades del dominio
- Define los casos de uso
- Contiene la lógica de aplicación
- Valida los datos de entrada

**Archivos en el proyecto:**
- `src/user/service/user.service.ts`
- `src/address/service/address.service.ts`
- `src/user/service/dto/*.dto.ts` (Commands)

#### 🟡 3. Capa de Infraestructura (Infrastructure Layer)
**Propósito:** Implementa los detalles técnicos (bases de datos, APIs externas).

**Características:**
- Implementa las interfaces del dominio
- Se conecta a bases de datos
- Realiza llamadas HTTP externas
- Maneja el almacenamiento

**Archivos en el proyecto:**
- `src/user/infrastructure/repositories/supabase.user.repository.ts`
- `src/address/infrastructure/repositories/supabase.address.repository.ts`
- `src/supabase/supabase.module.ts`

#### 🔴 4. Capa de Presentación (Presentation Layer)
**Propósito:** Maneja la comunicación con el mundo exterior (HTTP, WebSockets).

**Características:**
- Define los endpoints (rutas HTTP)
- Recibe las peticiones HTTP
- Valida el formato de entrada
- Devuelve las respuestas

**Archivos en el proyecto:**
- `src/user/presentation/user.controller.ts`
- `src/address/presentation/address.controller.ts`
- `src/user/presentation/dto/*.dto.ts` (Request DTOs)

### Flujo de Datos entre Capas

```
Cliente (Postman/Frontend)
        ↓
[PRESENTACIÓN: Controller]
        ↓ (Request DTO)
[APLICACIÓN: Service]
        ↓ (Command/Domain Model)
[INFRAESTRUCTURA: Repository]
        ↓ (SQL Query)
    Base de Datos
```

### Ventajas de Clean Architecture

✅ **Testeable:** Puedes probar la lógica sin base de datos
✅ **Mantenible:** Cambios en una capa no afectan a otras
✅ **Independiente de frameworks:** Puedes cambiar NestJS por Express
✅ **Independiente de la UI:** El mismo backend sirve para web, mobile, etc.
✅ **Independiente de la base de datos:** Puedes cambiar Supabase por MySQL

---

## 3. Arquitectura Modular

### ¿Qué es un Módulo?

Un **módulo** es una unidad organizacional que agrupa funcionalidades relacionadas.

```
Módulo USER
├── Domain      (Entidades y contratos)
├── Service     (Lógica de aplicación)
├── Infrastructure (Implementación técnica)
├── Presentation (Controllers)
└── user.module.ts (Configuración del módulo)
```

### Módulos en el Proyecto

```
src/
├── user/           ← Gestión de usuarios
├── address/        ← Gestión de direcciones
├── commerce/       ← Gestión de comercios
├── orders/         ← Gestión de pedidos
├── payments/       ← Gestión de pagos
├── logistics/      ← Gestión de envíos
├── admin/          ← Gestión administrativa
└── supabase/       ← Módulo compartido de conexión
```

### Ventajas de la Modularidad

✅ **Separación de responsabilidades:** Cada módulo tiene un propósito claro
✅ **Reusabilidad:** Los módulos pueden usarse en otros proyectos
✅ **Trabajo en equipo:** Diferentes desarrolladores pueden trabajar en módulos distintos
✅ **Lazy loading:** Se pueden cargar módulos bajo demanda

---

## 4. Análisis Capa por Capa

### 4.1 Capa de Dominio (Domain Layer)

#### 📄 Models (Entidades de Negocio)

**Ejemplo: User Model** - `src/user/domain/models/user.ts`

```typescript
export default class User {
    public constructor (
        private readonly email: string,
        private readonly password: string,
        private readonly first_name?: string,
        private readonly last_name?: string,
        private readonly phone_number?: number,
        private readonly id?: number,
        private readonly uuid?: string,
    ) {}

    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string {
        return this.password;
    }
    // ... más getters
}
```

**¿Por qué usar clases en lugar de interfaces?**

✅ **Encapsulación:** Los datos son privados y solo accesibles por getters
✅ **Lógica de negocio:** Puedes agregar métodos de validación
✅ **Inmutabilidad:** `readonly` previene cambios accidentales

**Ejemplo: Address Model** - `src/address/domain/models/address.ts`

```typescript
export default class Address {
    public constructor (
        private readonly user_id: string,
        private readonly street_address: string,
        private readonly city: string,
        private readonly postal_code: string,
        private readonly details?: string
    ) {}

    public getUser_id(): string {
        return this.user_id;
    }

    public getStreet_address(): string {
        return this.street_address;
    }
    // ... más getters
}
```

#### 📄 Contracts (Interfaces de Repositorios)

**Ejemplo: UserRepository Interface** - `src/user/domain/contract/user.repository.ts`

```typescript
import User from '../models/user';

export interface UserRepository {
  createUser(user: User): Promise<any>;
  loginUser(user: User): Promise<any>;
  resendVerificationEmail(email: string): Promise<any>;
  EditUserProfile(id: number, user: User): Promise<any>;
  delete(user_id: string): Promise<any>;
  updatePartialProfile(id: string, partialUser: Partial<{...}>): Promise<any>;
  findById(id: number): Promise<User | null>;
  getUserProfile(user_id: string): Promise<any>;
}
```

**¿Por qué usar interfaces?**

✅ **Inversión de dependencias:** El dominio define QUÉ hacer, no CÓMO
✅ **Flexibilidad:** Puedes cambiar de Supabase a MySQL sin tocar el dominio
✅ **Testing:** Puedes crear mocks fácilmente

**Principio clave:**
> El dominio NO sabe nada de Supabase, PostgreSQL, MongoDB, etc.
> Solo define el contrato que debe cumplirse.

---

### 4.2 Capa de Aplicación (Application/Service Layer)

#### 📄 Services (Lógica de Negocio)

**Ejemplo: UserService** - `src/user/service/user.service.ts`

```typescript
@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(dto: CreateUserCommand) {
    // 1. VALIDACIÓN DE NEGOCIO
    if (!dto.getEmail() || !dto.getPassword() ||
        !dto.getFirst_Name() || !dto.getLast_Name()) {
      throw new BadRequestException('Falta algún dato...');
    }

    // 2. CREAR ENTIDAD DE DOMINIO
    const user = new User(
      dto.getEmail(),
      dto.getPassword(),
      dto.getFirst_Name(),
      dto.getLast_Name()
    );

    // 3. DELEGAR A LA INFRAESTRUCTURA
    return this.userRepository.createUser(user);
  }

  async loginUser(dto: LoginUserCommand) {
    const user = new User(dto.getEmail(), dto.getPassword());
    return this.userRepository.loginUser(user);
  }
}
```

**Responsabilidades del Service:**

1. ✅ Validar reglas de negocio
2. ✅ Transformar DTOs en entidades de dominio
3. ✅ Orquestar operaciones
4. ✅ Coordinar múltiples repositorios si es necesario
5. ❌ NO conoce detalles de HTTP (códigos de estado, headers)
6. ❌ NO conoce detalles de base de datos (SQL, queries)

#### 📄 DTOs y Commands

**¿Qué es un DTO?**
Data Transfer Object: Objeto simple para transferir datos entre capas.

**Diferencia: Request DTO vs Command**

```
Request DTO (Presentation)  →  Command (Service)
        ↓                            ↓
   Validación HTTP          Validación de negocio
   class-validator          Lógica personalizada
```

**Ejemplo: CreateUserCommand** - `src/user/service/dto/CreateUser.dto.ts`

```typescript
export default class CreateUserCommand {
    constructor(
        private readonly email: string,
        private readonly password: string,
        private readonly first_name: string,
        private readonly last_name: string,
    ) {}

    public getEmail(): string { return this.email; }
    public getPassword(): string { return this.password; }
    public getFirst_Name(): string { return this.first_name; }
    public getLast_Name(): string { return this.last_name; }
}
```

**¿Por qué separar Request DTO y Command?**

✅ **Separación de responsabilidades**
✅ **La capa de aplicación no depende de la presentación**
✅ **Puedes tener múltiples Request DTOs que mapeen al mismo Command**

---

### 4.3 Capa de Infraestructura (Infrastructure Layer)

#### 📄 Repositorios Concretos

**Ejemplo: SupabaseUserRepository** - `src/user/infrastructure/repositories/supabase.user.repository.ts`

```typescript
@Injectable()
export class SupabaseUserRepository implements UserRepository {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabaseClient: SupabaseClient
  ) {}

  async createUser(user: User): Promise<any> {
    // 1. LLAMADA A SUPABASE AUTH
    let { data, error } = await this.supabaseClient.auth.signUp({
      email: user.getEmail(),
      password: user.getPassword()
    });

    if (error) {
      throw new Error('Usuario no creado: ' + error.message);
    }

    let newuuid = data.user?.id;

    if (!newuuid) {
      throw new Error('El perfil no se pudo crear');
    }

    // 2. CREAR PERFIL EN user_profiles
    await this.createProfile(user, newuuid);

    return data;
  }

  async createProfile(user: User, id: string) {
    const { error: profileError } = await this.supabaseClient
      .from('user_profiles')
      .insert({
        user_id: id,
        first_name: user.getFirst_Name(),
        last_name: user.getLast_Name(),
        role: 'customer'
      });

    if (profileError) {
      throw new Error('Error al crear perfil: ' + profileError.message);
    }

    return true;
  }

  async getUserProfile(user_id: string): Promise<any> {
    const { data, error } = await this.supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (error) {
      throw new Error('Perfil no encontrado: ' + error.message);
    }

    return data;
  }
}
```

**Responsabilidades del Repository:**

1. ✅ Implementar la interfaz del dominio
2. ✅ Traducir llamadas de dominio a operaciones de BD
3. ✅ Manejar errores específicos de la BD
4. ✅ Transformar datos de BD a entidades de dominio
5. ❌ NO contiene lógica de negocio
6. ❌ NO valida reglas de negocio

**Tablas de Supabase que usa:**

```sql
-- Tabla gestionada por Supabase Auth
auth.users (email, password, uuid)

-- Tabla personalizada
public.user_profiles (
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  phone_number INTEGER,
  role TEXT
)
```

---

### 4.4 Capa de Presentación (Presentation Layer)

#### 📄 Controllers (Endpoints HTTP)

**Ejemplo: UserController** - `src/user/presentation/user.controller.ts`

```typescript
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUserRequest(@Body() dto: CreateUserRequestDTO) {
    // 1. RECIBIR REQUEST DTO
    // 2. TRANSFORMAR A COMMAND
    const command = new CreateUserCommand(
      dto.email,
      dto.password,
      dto.first_name,
      dto.last_name
    );

    // 3. LLAMAR AL SERVICE
    return this.userService.createUser(command);
  }

  @Post('/login')
  async LoginUserRequest(@Body() dto: LoginUserRequestDTO) {
    const command = new LoginUserCommand(dto.email, dto.password);
    return this.userService.loginUser(command);
  }

  @Get('/profile')
  async getUserProfileRequest(@Body() user_id: string) {
    if (!user_id) {
      throw new BadRequestException('Se requiere el ID del usuario');
    }
    return this.userService.getUserProfile(user_id);
  }

  @Patch('/profile')
  async EditUserInfoRequest(@Body() dto: PatchUserRequestDTO) {
    if (!dto.user_id) {
      throw new BadRequestException('Se requiere el ID del usuario');
    }

    // Filtrar solo los campos enviados
    const updateData: Partial<PatchUserRequestDTO> = {};
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.first_name !== undefined) updateData.first_name = dto.first_name;
    if (dto.last_name !== undefined) updateData.last_name = dto.last_name;
    if (dto.phone_number !== undefined) updateData.phone_number = dto.phone_number;

    const command = new PatchUserCommand(
      dto.user_id,
      updateData.email,
      updateData.first_name,
      updateData.last_name,
      updateData.phone_number
    );

    return this.userService.EditUserInfo(command);
  }
}
```

**Decoradores de NestJS:**

| Decorador | Propósito | Ejemplo |
|-----------|-----------|---------|
| `@Controller('/users')` | Define la ruta base | `/users` |
| `@Post()` | Endpoint POST | `POST /users` |
| `@Get()` | Endpoint GET | `GET /users/profile` |
| `@Patch()` | Endpoint PATCH | `PATCH /users/profile` |
| `@Body()` | Extrae el cuerpo de la petición | `{ email, password }` |
| `@Param()` | Extrae parámetros de URL | `/users/:id` |

**Endpoints disponibles:**

```
POST   /api/users                  → Crear usuario
POST   /api/users/login            → Login
POST   /api/users/resend-email/:email → Reenviar email
GET    /api/users/profile          → Obtener perfil
PATCH  /api/users/profile          → Actualizar perfil
```

**Request DTO** - `src/user/presentation/dto/CreateUser.dto.ts`

```typescript
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export default class CreateUserRequestDTO {
    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;
}
```

**Validaciones con class-validator:**

- `@IsEmail()`: Valida formato de email
- `@MinLength(6)`: Mínimo 6 caracteres
- `@IsNotEmpty()`: No puede estar vacío

---

## 5. Patrones de Diseño Implementados

### 5.1 Repository Pattern

**Definición:**
Abstrae el acceso a datos proporcionando una interfaz de colección para acceder a entidades de dominio.

**Implementación en el proyecto:**

```
┌─────────────────────────────────────────┐
│    UserService (Capa de Aplicación)    │
│  - Usa: UserRepository (interfaz)      │
└───────────────┬─────────────────────────┘
                │ Depende de la abstracción
                ↓
┌─────────────────────────────────────────┐
│  UserRepository Interface (Dominio)     │
│  - createUser(user: User)               │
│  - loginUser(user: User)                │
│  - getUserProfile(id: string)           │
└───────────────┬─────────────────────────┘
                │ Implementada por
                ↓
┌─────────────────────────────────────────┐
│ SupabaseUserRepository (Infraestructura)│
│  - Implementa: UserRepository           │
│  - Conecta con: Supabase                │
└─────────────────────────────────────────┘
```

**Ventaja:**
Si mañana quieres cambiar Supabase por MySQL, solo creas `MySQLUserRepository` sin tocar el Service.

---

### 5.2 Dependency Injection (DI)

**Definición:**
En lugar de que una clase cree sus propias dependencias, se las inyectan desde afuera.

**Sin DI (❌ Malo):**
```typescript
class UserService {
  private repository = new SupabaseUserRepository(); // ❌ Acoplamiento fuerte
}
```

**Con DI (✅ Bueno):**
```typescript
@Injectable()
class UserService {
  constructor(
    @Inject('UserRepository') // ✅ Inyectado desde fuera
    private readonly userRepository: UserRepository
  ) {}
}
```

**Configuración en el módulo:**

```typescript
// src/user/user.module.ts
@Module({
  providers: [
    UserService,
    {
      provide: 'UserRepository',          // Token de inyección
      useClass: SupabaseUserRepository,   // Implementación concreta
    },
  ],
})
export class UserModule {}
```

**Ventajas:**
✅ Fácil de testear (puedes inyectar mocks)
✅ Bajo acoplamiento
✅ Fácil de cambiar implementaciones

---

### 5.3 DTO Pattern (Data Transfer Object)

**Definición:**
Objetos simples para transferir datos entre capas sin lógica de negocio.

**Flujo de DTOs en el proyecto:**

```
Cliente envía JSON
        ↓
CreateUserRequestDTO (Presentation)
        ↓ (mapeo)
CreateUserCommand (Service)
        ↓ (mapeo)
User (Domain Model)
        ↓
Repository → Base de Datos
```

**¿Por qué 3 niveles de objetos?**

1. **Request DTO:** Validación HTTP (class-validator)
2. **Command:** Validación de negocio
3. **Domain Model:** Entidad con comportamiento

---

### 5.4 Command Pattern

**Definición:**
Encapsula una solicitud como un objeto, permitiendo parametrizar clientes con diferentes solicitudes.

**Ejemplo:**
```typescript
// Command
class CreateUserCommand {
  constructor(
    private email: string,
    private password: string,
    private first_name: string,
    private last_name: string
  ) {}
}

// Handler (Service)
class UserService {
  async createUser(command: CreateUserCommand) {
    // Ejecuta el comando
  }
}
```

**Ventajas:**
✅ Desacopla quien invoca la acción de quien la ejecuta
✅ Facilita el logging y auditoría
✅ Permite hacer undo/redo

---

### 5.5 Factory Pattern

**Implementación: SupabaseModule**

```typescript
// src/supabase/supabase.module.ts
const SupabaseProvider = {
  provide: 'SUPABASE_CLIENT',
  useFactory: () => {
    const supabaseUrl = 'https://nxilakpwsjqgerrviayg.supabase.co';
    const supabaseKey = 'eyJhbG...';
    return createClient(supabaseUrl, supabaseKey); // Factory
  },
};

@Module({
  providers: [SupabaseProvider],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule {}
```

**¿Qué hace?**
Crea una instancia de SupabaseClient que se inyecta en todos los repositorios.

---

## 6. Principios SOLID Aplicados

### S - Single Responsibility Principle (SRP)

**Definición:** Una clase debe tener una sola razón para cambiar.

**Aplicación:**
```
✅ UserController      → Solo maneja HTTP
✅ UserService         → Solo lógica de negocio
✅ UserRepository      → Solo acceso a datos
✅ User (Model)        → Solo representa un usuario
```

---

### O - Open/Closed Principle (OCP)

**Definición:** Abierto para extensión, cerrado para modificación.

**Aplicación:**
```typescript
// Puedes agregar nuevas implementaciones sin modificar el código existente
interface UserRepository { }

class SupabaseUserRepository implements UserRepository { }
class MySQLUserRepository implements UserRepository { }  // ✅ Extensión
class MongoUserRepository implements UserRepository { }  // ✅ Extensión
```

---

### L - Liskov Substitution Principle (LSP)

**Definición:** Los objetos de una subclase deben poder reemplazar a los de la superclase.

**Aplicación:**
```typescript
// UserService NO sabe si usa Supabase, MySQL o Mongo
// Cualquier implementación de UserRepository funciona
constructor(
  @Inject('UserRepository')
  private readonly userRepository: UserRepository  // ✅ Cualquier implementación
) {}
```

---

### I - Interface Segregation Principle (ISP)

**Definición:** Los clientes no deberían depender de interfaces que no usan.

**Aplicación:**
```typescript
// En lugar de una interfaz gigante
interface SuperRepository {
  createUser() {}
  deleteUser() {}
  createAddress() {}
  deleteAddress() {}
  createOrder() {}
  // ... 50 métodos más
}

// ✅ Interfaces segregadas
interface UserRepository {
  createUser() {}
  deleteUser() {}
}

interface AddressRepository {
  createAddress() {}
  deleteAddress() {}
}
```

---

### D - Dependency Inversion Principle (DIP)

**Definición:** Depende de abstracciones, no de implementaciones concretas.

**Aplicación:**
```typescript
// ❌ MAL: Depende de implementación concreta
class UserService {
  private repository = new SupabaseUserRepository();
}

// ✅ BIEN: Depende de abstracción
class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository  // Interfaz
  ) {}
}
```

---

## 7. Flujo Completo de una Request

### Ejemplo: Crear un Usuario

**1. Cliente envía petición HTTP**
```http
POST /api/users
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret123",
  "first_name": "Juan",
  "last_name": "Pérez"
}
```

**2. Llega al Controller (Presentación)**
```typescript
// src/user/presentation/user.controller.ts

@Post()
async createUserRequest(@Body() dto: CreateUserRequestDTO) {
  // ✅ class-validator valida automáticamente el DTO
  // ✅ Si falla la validación, devuelve 400 Bad Request

  const command = new CreateUserCommand(
    dto.email,      // "user@example.com"
    dto.password,   // "secret123"
    dto.first_name, // "Juan"
    dto.last_name   // "Pérez"
  );

  return this.userService.createUser(command);
}
```

**3. Va al Service (Aplicación)**
```typescript
// src/user/service/user.service.ts

async createUser(dto: CreateUserCommand) {
  // PASO 1: Validar reglas de negocio
  if (!dto.getEmail() || !dto.getPassword() ||
      !dto.getFirst_Name() || !dto.getLast_Name()) {
    throw new BadRequestException('Falta algún dato...');
  }

  // PASO 2: Crear entidad de dominio
  const user = new User(
    dto.getEmail(),
    dto.getPassword(),
    dto.getFirst_Name(),
    dto.getLast_Name()
  );

  // PASO 3: Llamar al repository
  return this.userRepository.createUser(user);
}
```

**4. Va al Repository (Infraestructura)**
```typescript
// src/user/infrastructure/repositories/supabase.user.repository.ts

async createUser(user: User): Promise<any> {
  // PASO 1: Crear usuario en Supabase Auth
  let { data, error } = await this.supabaseClient.auth.signUp({
    email: user.getEmail(),
    password: user.getPassword()
  });

  if (error) {
    throw new Error('Usuario no creado: ' + error.message);
  }

  let newuuid = data.user?.id;  // UUID generado por Supabase

  // PASO 2: Crear perfil en la tabla user_profiles
  await this.createProfile(user, newuuid);

  return data;
}

async createProfile(user: User, id: string) {
  const { error: profileError } = await this.supabaseClient
    .from('user_profiles')
    .insert({
      user_id: id,
      first_name: user.getFirst_Name(),
      last_name: user.getLast_Name(),
      role: 'customer'
    });

  if (profileError) {
    throw new Error('Error al crear perfil: ' + profileError.message);
  }
}
```

**5. Supabase guarda en la base de datos**
```sql
-- Tabla: auth.users
INSERT INTO auth.users (id, email, encrypted_password)
VALUES ('uuid-generado', 'user@example.com', 'hash-bcrypt');

-- Tabla: public.user_profiles
INSERT INTO user_profiles (user_id, first_name, last_name, role)
VALUES ('uuid-generado', 'Juan', 'Pérez', 'customer');
```

**6. Respuesta al cliente**
```json
{
  "user": {
    "id": "uuid-generado",
    "email": "user@example.com",
    "email_confirmed_at": null,
    "created_at": "2025-01-15T10:30:00Z"
  },
  "session": {
    "access_token": "eyJhbG...",
    "refresh_token": "v1.Ma...",
    "expires_in": 3600
  }
}
```

### Diagrama de Flujo Completo

```
Cliente (Postman/Frontend)
    │
    │ POST /api/users { email, password, ... }
    ↓
┌─────────────────────────────────────────┐
│  UserController (Presentación)          │
│  - Validación HTTP (class-validator)    │
│  - Mapeo: RequestDTO → Command          │
└─────────────┬───────────────────────────┘
              │ createUser(command)
              ↓
┌─────────────────────────────────────────┐
│  UserService (Aplicación)               │
│  - Validación de negocio                │
│  - Mapeo: Command → User (Domain)       │
└─────────────┬───────────────────────────┘
              │ createUser(user)
              ↓
┌─────────────────────────────────────────┐
│  SupabaseUserRepository (Infraestructura)│
│  - Llamada a Supabase Auth API          │
│  - INSERT en tabla user_profiles        │
└─────────────┬───────────────────────────┘
              │ SQL/HTTP
              ↓
┌─────────────────────────────────────────┐
│  Supabase (Base de Datos PostgreSQL)   │
│  - auth.users                           │
│  - public.user_profiles                 │
└─────────────────────────────────────────┘
```

---

### Ejemplo: Obtener Direcciones de un Usuario

**1. Cliente envía petición**
```http
GET /api/address
Content-Type: application/json

{
  "user_id": "uuid-del-usuario"
}
```

**2. Controller (Presentación)**
```typescript
// src/address/presentation/address.controller.ts

@Get()
findAllAddressByUserID(@Body() user_id: string) {
  return this.addressService.findAllAddressByUserID(user_id);
}
```

**3. Service (Aplicación)**
```typescript
// src/address/service/address.service.ts

findAllAddressByUserID(user_id: string) {
  // Simplemente delega al repository
  return this.addressRepository.findAllAddressByUserID(user_id);
}
```

**4. Repository (Infraestructura)**
```typescript
// src/address/infrastructure/repositories/supabase.address.repository.ts

async findAllAddressByUserID(user_id: string): Promise<Address[]> {
  const { data, error } = await this.supabaseClient
    .from('addresses')
    .select('*')
    .eq('user_id', user_id);  // WHERE user_id = 'uuid'

  if (error) {
    throw new BadRequestException('Error al obtener las direcciones: ' + error.message);
  }

  return data as Address[];
}
```

**5. Consulta SQL en Supabase**
```sql
SELECT * FROM addresses WHERE user_id = 'uuid-del-usuario';
```

**6. Respuesta al cliente**
```json
[
  {
    "id": "1",
    "user_id": "uuid-del-usuario",
    "street_address": "Calle Falsa 123",
    "city": "Springfield",
    "postal_code": "1234",
    "details": "Departamento 4B"
  },
  {
    "id": "2",
    "user_id": "uuid-del-usuario",
    "street_address": "Av. Siempreviva 742",
    "city": "Springfield",
    "postal_code": "1235",
    "details": null
  }
]
```

---

## 8. Estructura de Directorios

### Vista General

```
TrabajoPractico-MarketPlace/
├── src/
│   ├── main.ts                    ← Punto de entrada de la aplicación
│   ├── app.module.ts              ← Módulo raíz que importa todos los módulos
│   ├── app.controller.ts          ← Controller principal
│   ├── app.service.ts             ← Service principal
│   │
│   ├── supabase/                  ← Módulo compartido de conexión
│   │   └── supabase.module.ts
│   │
│   ├── user/                      ← Módulo de usuarios (Clean Architecture)
│   │   ├── domain/
│   │   │   ├── models/
│   │   │   │   └── user.ts
│   │   │   └── contract/
│   │   │       └── user.repository.ts
│   │   ├── service/
│   │   │   ├── user.service.ts
│   │   │   └── dto/
│   │   │       ├── CreateUser.dto.ts
│   │   │       ├── UpdateUser.dto.ts
│   │   │       ├── LoginUser.dto.ts
│   │   │       └── DeleteUser.dto.ts
│   │   ├── infrastructure/
│   │   │   └── repositories/
│   │   │       └── supabase.user.repository.ts
│   │   ├── presentation/
│   │   │   ├── user.controller.ts
│   │   │   └── dto/
│   │   │       ├── CreateUser.dto.ts
│   │   │       ├── UpdateUser.dto.ts
│   │   │       ├── LoginUserRequest.dto.ts
│   │   │       └── DeleteUser.dto.ts
│   │   └── user.module.ts
│   │
│   ├── address/                   ← Módulo de direcciones (Clean Architecture)
│   │   ├── domain/
│   │   │   ├── models/
│   │   │   │   └── address.ts
│   │   │   └── contract/
│   │   │       └── address.repository.ts
│   │   ├── service/
│   │   │   ├── address.service.ts
│   │   │   └── dto/
│   │   │       ├── CreateAddress.dto.ts
│   │   │       ├── UpdateAddress.dto.ts
│   │   │       └── GetAddress.dto.ts
│   │   ├── infrastructure/
│   │   │   └── repositories/
│   │   │       └── supabase.address.repository.ts
│   │   ├── presentation/
│   │   │   ├── address.controller.ts
│   │   │   └── dto/
│   │   │       ├── CreateAddress.dto.ts
│   │   │       └── UpdateAddress.dto.ts
│   │   └── address.module.ts
│   │
│   ├── commerce/                  ← Módulo de comercios
│   │   ├── vendor/                ← Submódulo de vendedores
│   │   │   ├── vendor.controller.ts
│   │   │   ├── vendor.service.ts
│   │   │   ├── vendor.module.ts
│   │   │   └── dto/
│   │   │       ├── vendor.dto.ts
│   │   │       └── updatevendor.dto.ts
│   │   ├── commerce.controller.ts
│   │   ├── commerce.service.ts
│   │   ├── commerce.module.ts
│   │   ├── dto/
│   │   │   ├── create-commerce.dto.ts
│   │   │   └── update-commerce.dto.ts
│   │   └── entities/
│   │       └── commerce.entity.ts
│   │
│   ├── orders/                    ← Módulo de pedidos
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   ├── orders.module.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   ├── payments/                  ← Módulo de pagos
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   ├── payments.module.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   ├── logistics/                 ← Módulo de logística
│   │   ├── logistics.controller.ts
│   │   ├── logistics.service.ts
│   │   ├── logistics.module.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   └── admin/                     ← Módulo de administración
│       ├── admin.controller.ts
│       ├── admin.service.ts
│       ├── admin.module.ts
│       ├── dto/
│       └── entities/
│
├── test/                          ← Tests end-to-end
│   └── app.e2e-spec.ts
│
├── node_modules/                  ← Dependencias
├── package.json                   ← Configuración de npm
├── tsconfig.json                  ← Configuración de TypeScript
├── nest-cli.json                  ← Configuración de NestJS CLI
└── README.md                      ← Documentación del proyecto
```

### Convenciones de Nomenclatura

#### Archivos

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Controllers | `*.controller.ts` | `user.controller.ts` |
| Services | `*.service.ts` | `user.service.ts` |
| Modules | `*.module.ts` | `user.module.ts` |
| Entities/Models | `*.ts` o `*.entity.ts` | `user.ts`, `commerce.entity.ts` |
| DTOs | `*.dto.ts` | `CreateUser.dto.ts` |
| Repositories | `*.repository.ts` | `supabase.user.repository.ts` |
| Interfaces | `*.interface.ts` o `*.repository.ts` | `user.repository.ts` |
| Tests | `*.spec.ts` | `user.service.spec.ts` |

#### Clases

```typescript
// Controllers
export class UserController { }

// Services
export class UserService { }

// Models
export default class User { }

// DTOs
export default class CreateUserRequestDTO { }
export default class CreateUserCommand { }

// Repositories (implementaciones)
export class SupabaseUserRepository implements UserRepository { }

// Repositories (interfaces)
export interface UserRepository { }
```

### Diferencias entre Módulos

#### Módulos con Clean Architecture (user, address)
```
✅ Tienen 4 capas completas
✅ Domain, Service, Infrastructure, Presentation
✅ Separación clara de responsabilidades
```

#### Módulos tradicionales (commerce, orders, payments, logistics, admin)
```
⚠️ Estructura más simple
⚠️ No implementan Clean Architecture completamente
⚠️ Tienen entities en lugar de domain models
⚠️ No tienen capa de infraestructura separada
```

**Próximo paso:** Migrar estos módulos a Clean Architecture.

---

## 9. Configuración y Módulos Compartidos

### 9.1 SupabaseModule (Módulo Compartido)

**Archivo:** `src/supabase/supabase.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

const SupabaseProvider = {
  provide: 'SUPABASE_CLIENT',
  useFactory: () => {
    const supabaseUrl = 'https://nxilakpwsjqgerrviayg.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
    return createClient(supabaseUrl, supabaseKey);
  },
};

@Module({
  providers: [SupabaseProvider],
  exports: ['SUPABASE_CLIENT'],  // ← Exporta para usar en otros módulos
})
export class SupabaseModule {}
```

**¿Qué hace?**

1. Crea una **instancia única** del cliente de Supabase (Singleton)
2. La **exporta** para que otros módulos la usen
3. Usa el patrón **Factory** para crear el cliente

**Uso en otros módulos:**

```typescript
// src/user/user.module.ts
@Module({
  imports: [SupabaseModule],  // ← Importa el módulo
  providers: [
    {
      provide: 'UserRepository',
      useClass: SupabaseUserRepository,  // ← Inyectará SUPABASE_CLIENT
    },
  ],
})
export class UserModule {}

// src/user/infrastructure/repositories/supabase.user.repository.ts
@Injectable()
export class SupabaseUserRepository {
  constructor(
    @Inject('SUPABASE_CLIENT')  // ← Inyecta el cliente
    private readonly supabaseClient: SupabaseClient
  ) {}
}
```

---

### 9.2 AppModule (Módulo Raíz)

**Archivo:** `src/app.module.ts`

```typescript
@Module({
  imports: [
    VendorModule,
    UserModule,
    CommerceModule,
    LogisticsModule,
    OrdersModule,
    PaymentsModule,
    AdminModule,
    AddressModule
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
```

**Responsabilidad:**
Importa y configura todos los módulos de la aplicación.

---

### 9.3 main.ts (Punto de Entrada)

**Archivo:** `src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';  // ← Todas las rutas empiezan con /api

  app.useGlobalPipes(new ValidationPipe());  // ← Habilita validación automática
  app.setGlobalPrefix(globalPrefix);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

**Configuración:**

1. **ValidationPipe:** Valida automáticamente los DTOs con class-validator
2. **Global Prefix:** Agrega `/api` a todas las rutas
   - `/users` → `/api/users`
   - `/address` → `/api/address`
3. **Puerto:** 3000 por defecto

---

### 9.4 Dependency Injection en NestJS

#### Cómo funciona la inyección de dependencias

**1. Definir un Provider**
```typescript
@Module({
  providers: [
    UserService,  // ← Forma corta
    // Equivale a:
    {
      provide: UserService,
      useClass: UserService,
    }
  ],
})
```

**2. Inyectar en un Constructor**
```typescript
@Controller('/users')
export class UserController {
  constructor(
    private readonly userService: UserService  // ← NestJS lo inyecta
  ) {}
}
```

#### Tipos de Providers

**1. Class Provider (useClass)**
```typescript
{
  provide: 'UserRepository',
  useClass: SupabaseUserRepository,  // ← Instancia esta clase
}
```

**2. Factory Provider (useFactory)**
```typescript
{
  provide: 'SUPABASE_CLIENT',
  useFactory: () => {
    return createClient(url, key);  // ← Ejecuta esta función
  },
}
```

**3. Value Provider (useValue)**
```typescript
{
  provide: 'CONFIG',
  useValue: { apiKey: 'abc123' },  // ← Usa este valor directamente
}
```

#### Tokens de Inyección

**String Token:**
```typescript
@Inject('UserRepository')
private readonly userRepository: UserRepository
```

**Class Token:**
```typescript
constructor(private readonly userService: UserService) {}
// Equivale a:
constructor(@Inject(UserService) private readonly userService: UserService) {}
```

---

## 10. Glosario de Términos

### Arquitectura

| Término | Definición | Analogía |
|---------|------------|----------|
| **Clean Architecture** | Arquitectura en capas donde las capas internas no conocen a las externas | Capas de una cebolla |
| **Modular Architecture** | Organizar el código en módulos independientes y reutilizables | Piezas de LEGO |
| **Layered Architecture** | Separar el código en capas con responsabilidades específicas | Capas de un pastel |

### Capas

| Término | Definición | Responsabilidad |
|---------|------------|-----------------|
| **Domain Layer** | Capa de negocio pura | Reglas del negocio, entidades |
| **Application Layer** | Capa de lógica de aplicación | Casos de uso, orquestación |
| **Infrastructure Layer** | Capa de implementación técnica | Bases de datos, APIs externas |
| **Presentation Layer** | Capa de comunicación externa | HTTP, WebSockets, GraphQL |

### Patrones de Diseño

| Término | Definición | Ejemplo |
|---------|------------|---------|
| **Repository Pattern** | Abstrae el acceso a datos | `UserRepository` interface |
| **Dependency Injection** | Inyectar dependencias desde fuera | Constructor injection |
| **DTO Pattern** | Objetos para transferir datos | `CreateUserRequestDTO` |
| **Command Pattern** | Encapsular solicitudes como objetos | `CreateUserCommand` |
| **Factory Pattern** | Crear objetos sin exponer lógica de creación | `useFactory` en providers |
| **Singleton Pattern** | Una sola instancia compartida | `SupabaseClient` |

### Conceptos de NestJS

| Término | Definición | Ejemplo |
|---------|------------|---------|
| **Module** | Unidad organizacional que agrupa funcionalidades | `UserModule` |
| **Controller** | Maneja peticiones HTTP | `@Controller('/users')` |
| **Service** | Contiene lógica de negocio | `@Injectable()` |
| **Provider** | Cualquier clase inyectable | Services, Repositories |
| **Decorator** | Anotaciones que modifican clases/métodos | `@Get()`, `@Post()` |
| **Pipe** | Transforma o valida datos de entrada | `ValidationPipe` |

### Conceptos de TypeScript

| Término | Definición | Ejemplo |
|---------|------------|---------|
| **Interface** | Contrato que define la forma de un objeto | `interface UserRepository {}` |
| **Class** | Plantilla para crear objetos | `class User {}` |
| **Generic** | Tipos parametrizados | `Promise<User>` |
| **Decorator** | Función que modifica clases/métodos | `@Injectable()` |
| **Type** | Alias de tipos | `type UserRole = 'admin' | 'customer'` |

### Conceptos de Base de Datos

| Término | Definición | Ejemplo |
|---------|------------|---------|
| **Repository** | Patrón que abstrae acceso a datos | `UserRepository` |
| **Entity** | Objeto que representa una tabla | `User` |
| **Migration** | Script para cambiar el esquema de BD | `CREATE TABLE users` |
| **Query** | Consulta a la base de datos | `SELECT * FROM users` |

### Supabase

| Término | Definición | Uso |
|---------|------------|-----|
| **Supabase Client** | Cliente JavaScript para conectarse a Supabase | `createClient(url, key)` |
| **Auth** | Sistema de autenticación | `supabase.auth.signUp()` |
| **Database** | PostgreSQL gestionado | `supabase.from('users')` |
| **Row Level Security** | Seguridad a nivel de fila | Políticas en tablas |

### HTTP/REST

| Término | Definición | Uso |
|---------|------------|-----|
| **Endpoint** | URL que expone funcionalidad | `/api/users` |
| **HTTP Method** | Tipo de operación | GET, POST, PUT, PATCH, DELETE |
| **Request Body** | Datos enviados en la petición | JSON con datos |
| **Response** | Respuesta del servidor | JSON con resultado |
| **Status Code** | Código de estado HTTP | 200 OK, 404 Not Found |

### Validación

| Término | Definición | Ejemplo |
|---------|------------|---------|
| **class-validator** | Librería para validar DTOs | `@IsEmail()` |
| **Decorator** | Anotación de validación | `@MinLength(6)` |
| **ValidationPipe** | Pipe que ejecuta validaciones | `app.useGlobalPipes()` |

---

## 📖 Resumen Final

### ¿Qué aprendiste?

✅ **Clean Architecture:** 4 capas (Domain, Application, Infrastructure, Presentation)
✅ **Arquitectura Modular:** Organización por módulos independientes
✅ **Patrones de Diseño:** Repository, DI, DTO, Command, Factory
✅ **Principios SOLID:** SRP, OCP, LSP, ISP, DIP
✅ **Flujo de una Request:** Desde HTTP hasta la base de datos
✅ **NestJS:** Decoradores, Modules, Controllers, Services, Providers
✅ **TypeScript:** Classes, Interfaces, Decorators
✅ **Supabase:** Auth, Database, Client

### Ventajas de esta Arquitectura

✅ **Mantenibilidad:** Código organizado y fácil de entender
✅ **Escalabilidad:** Fácil agregar nuevos módulos
✅ **Testeable:** Cada capa se puede probar independientemente
✅ **Flexibilidad:** Fácil cambiar implementaciones (Supabase → MySQL)
✅ **Reutilización:** Los módulos pueden usarse en otros proyectos
✅ **Separación de responsabilidades:** Cada capa tiene un propósito claro

### Próximos Pasos

1. 📝 **Migrar módulos faltantes** a Clean Architecture (commerce, orders, payments, logistics, admin)
2. 🧪 **Agregar tests unitarios** para Services y Repositories
3. 🔒 **Implementar autenticación** con Guards de NestJS
4. 📚 **Agregar documentación** con Swagger/OpenAPI
5. 🚀 **Deploy** a producción (Vercel, Railway, AWS)

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [NestJS Documentation](https://docs.nestjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Clean Architecture

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

### Patrones de Diseño

- [Refactoring Guru - Design Patterns](https://refactoring.guru/design-patterns)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)

---

## 🎯 Consejos para Explicar la Arquitectura

### Cuando expliques a alguien:

1. **Empieza por el problema:** "¿Por qué necesitamos esta arquitectura?"
2. **Usa analogías:** Compara con cosas del mundo real (empresa, capas de cebolla)
3. **Muestra el flujo completo:** Sigue una request desde HTTP hasta la BD
4. **Compara con alternativas:** "Sin Clean Architecture vs Con Clean Architecture"
5. **Usa diagramas:** Dibujos simples ayudan mucho
6. **Da ejemplos concretos:** Muestra código real del proyecto

### Estructura de presentación:

1. ¿Qué problema resolvemos?
2. ¿Qué es Clean Architecture? (concepto general)
3. Las 4 capas explicadas
4. Ejemplo práctico: Crear un usuario (paso a paso)
5. Ventajas y desventajas
6. Comparación con otras arquitecturas
7. Preguntas

---

**Creado para:** Trabajo Práctico Marketplace
**Fecha:** Enero 2025
**Autor:** Equipo de desarrollo

¡Feliz aprendizaje! 🚀
