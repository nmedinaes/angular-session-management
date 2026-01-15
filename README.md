# Angular Session Management

Aplicación Angular con funcionalidades de autenticación, gestión de productos y diferentes roles de usuario.

## Características

- **Autenticación**: Sistema de login con roles (Admin/Usuario)
- **Calendario de Sesiones**: Vista de calendario mensual con filtros por categoría y estado
- **Gestión de Sesiones**: CRUD completo para administradores
- **Protección de Rutas**: Guards para autenticación y roles
- **Diseño Moderno**: Basado en la fuente Satoshi

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # Guards de autenticación y roles
│   │   ├── interceptors/    # Interceptores HTTP
│   │   ├── layout/          # Componentes de layout (menú, etc.)
│   │   ├── models/          # Modelos e interfaces
│   │   └── services/        # Servicios (auth, session)
│   ├── features/
│   │   ├── admin/           # Módulo de administración
│   │   ├── auth/            # Módulo de autenticación
│   │   └── calendar/        # Módulo de calendario
│   └── app.routes.ts        # Configuración de rutas
└── ...
```

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## Roles

- **Administrador**: Usuarios con email del dominio `@sdi.es`
- **Usuario Registrado**: Resto de usuarios autenticados

## Tecnologías

- Angular 17
- TypeScript
- RxJS
- Font Awesome
- Satoshi Font
