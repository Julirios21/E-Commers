# E-Shop

Plataforma de e-commerce fullstack con arquitectura de microservicios, desplegada con Docker Compose.

## Stack Tecnologico

| Servicio | Tecnologia | Version |
|----------|-----------|---------|
| Frontend | Next.js (App Router) | 16.3.5 |
| UI | React | 19.2.8 |
| Estilos | Tailwind CSS | 4 |
| Backend | NestJS | 12.0.1 |
| ORM | TypeORM | 1.1.1 |
| Base de datos | PostgreSQL | 16 |
| Auth | Passport JWT + bcrypt | - |
| State | Zustand | 5.0.15 |
| Formularios | React Hook Form + Zod | 7.88 / 4.6 |

## Prerrequisitos

- [Node.js](https://nodejs.org/) >= 20
- [Docker](https://www.docker.com/) + Docker Compose
- npm

## Instalacion

### Con Docker (recomendado)

```bash
git clone <repo-url>
cd E-Commers
docker compose up --build
```

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:3000 |
| pgAdmin | http://localhost:5050 |

### Desarrollo local

**Backend:**
```bash
cd Backend
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Estructura del Proyecto

```
E-Commers/
├── Backend/                  # API REST (NestJS)
│   ├── src/
│   │   ├── auth/             # Login, registro, JWT, roles
│   │   ├── users/            # CRUD de usuarios
│   │   ├── categories/       # CRUD de categorias
│   │   ├── products/         # CRUD de productos
│   │   ├── cart/             # Carrito de compras
│   │   ├── orders/           # Pedidos
│   │   └── payments/         # Pagos
│   ├── Dockerfile
│   └── package.json
├── frontend/                 # App web (Next.js)
│   ├── src/
│   │   ├── app/              # Paginas (App Router)
│   │   ├── components/       # Componentes UI
│   │   ├── stores/           # Zustand (auth, cart)
│   │   ├── lib/              # Utilidades, API client
│   │   └── types/            # Tipos TypeScript
│   ├── Dockerfile
│   └── package.json
├── DB/
│   └── Database.sql          # Schema de la base de datos
├── docker-compose.yaml
├── .env
└── README.md
```

## Variables de Entorno

Crea un archivo `.env` en la raiz del proyecto con las siguientes variables:

| Variable | Descripcion | Requerido |
|----------|-------------|-----------|
| `DB_HOST` | Host de PostgreSQL | Si |
| `DB_PORT` | Puerto de PostgreSQL | Si |
| `DB_USER` | Usuario de PostgreSQL | Si |
| `DB_PASS` | Contrasena de PostgreSQL | Si |
| `DB_NAME` | Nombre de la base de datos | Si |
| `JWT_SECRET` | Secreto para firmar tokens JWT | Si |
| `JWT_EXPIRES` | Tiempo de expiracion del token | No |
| `PORT` | Puerto del backend | No |
| `NEXT_PUBLIC_API_URL` | URL del API para el frontend | No |

> Ver `.env.example` para valores de ejemplo.

## API Endpoints

### Auth
| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Registrar usuario |
| POST | `/auth/login` | No | Iniciar sesion |
| GET | `/auth/profile` | JWT | Obtener perfil |

### Products
| Metodo | Ruta | Auth | Rol | Descripcion |
|--------|------|------|-----|-------------|
| GET | `/products` | No | - | Listar productos (filtros: `category_id`, `search`) |
| GET | `/products/:id` | No | - | Obtener producto |
| POST | `/products` | JWT | admin | Crear producto |
| PUT | `/products/:id` | JWT | admin | Actualizar producto |
| DELETE | `/products/:id` | JWT | admin | Eliminar producto |

### Categories
| Metodo | Ruta | Auth | Rol | Descripcion |
|--------|------|------|-----|-------------|
| GET | `/categories` | No | - | Listar categorias |
| GET | `/categories/:id` | No | - | Obtener categoria |
| POST | `/categories` | JWT | admin | Crear categoria |
| PUT | `/categories/:id` | JWT | admin | Actualizar categoria |
| DELETE | `/categories/:id` | JWT | admin | Eliminar categoria |

### Cart
| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/cart` | JWT | Obtener carrito |
| POST | `/cart` | JWT | Agregar item |
| PATCH | `/cart/:id` | JWT | Actualizar cantidad |
| DELETE | `/cart/:id` | JWT | Eliminar item |
| DELETE | `/cart` | JWT | Vaciar carrito |

### Orders
| Metodo | Ruta | Auth | Rol | Descripcion |
|--------|------|------|-----|-------------|
| GET | `/orders` | JWT | customer/admin | Listar pedidos |
| GET | `/orders/:id` | JWT | customer | Obtener pedido |
| POST | `/orders` | JWT | customer | Crear pedido desde carrito |
| PATCH | `/orders/:id/status` | JWT | admin | Actualizar estado |

### Payments
| Metodo | Ruta | Auth | Rol | Descripcion |
|--------|------|------|-----|-------------|
| POST | `/payments` | JWT | customer | Crear pago |
| GET | `/payments` | JWT | admin | Listar todos los pagos |
| GET | `/payments/order/:orderId` | JWT | customer | Pagos de un pedido |
| PATCH | `/payments/:id/complete` | JWT | admin | Marcar pago como completado |

### Users (admin)
| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/users` | JWT + admin | Listar usuarios |
| GET | `/users/:id` | JWT + admin | Obtener usuario |
| PUT | `/users/:id` | JWT + admin | Actualizar usuario |
| DELETE | `/users/:id` | JWT + admin | Eliminar usuario |

## Roles

| Rol | Permisos |
|-----|----------|
| `admin` | CRUD completo de productos, categorias, usuarios. Gestion de pedidos y pagos. Panel de administracion. |
| `customer` | Ver productos, gestionar carrito, crear pedidos, ver sus pedidos, realizar pagos. |

## Base de Datos

Diagrama de entidades:

- **users** — Usuarios con rol (admin/customer)
- **categories** — Categorias de productos
- **products** — Productos con precio, stock, categoria
- **cart_items** — Items del carrito por usuario
- **orders** — Pedidos con estado y total
- **order_items** — Detalle de items por pedido
- **payments** — Pagos asociados a pedidos

## Licencia

UNLICENSED
