# Backend - Sistema de Gestión para Salón de Uñas

Este backend implementa la lógica y la persistencia para la gestión de clientes, diseños, turnos, promociones y usuarios.

## Características
- Autenticación de usuarios con login.
- CRUD de clientes.
- CRUD de diseños.
- CRUD de turnos.
- CRUD de promociones.
- Base de datos SQLite.

## Instalación
1. Abra la carpeta `BAKEND`.
2. Ejecute:
   ```bash
   npm install
   ```
3. Inicie el servidor:
   ```bash
   npm start
   ```

## Endpoints principales
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/clients`
- `POST /api/clients`
- `PUT /api/clients/:id`
- `DELETE /api/clients/:id`
- `GET /api/designs`
- `POST /api/designs`
- `GET /api/appointments`
- `POST /api/appointments`
- `GET /api/promotions`
- `POST /api/promotions`

## Usuario inicial
- usuario: `admin`
- password: `admin123`
