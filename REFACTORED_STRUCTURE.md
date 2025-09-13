# Backend Refactored Structure

## Overview
The backend has been refactored into a modular, organized structure for better maintainability and scalability.

## New Directory Structure

```
src/
├── modules/                    # Feature-based modules
│   ├── auth/                   # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.service.ts
│   │   └── auth.types.ts
│   ├── user/                   # User management module
│   │   ├── user.controller.ts
│   │   ├── user.model.ts
│   │   ├── user.routes.ts
│   │   └── user.types.ts
│   ├── weather/                # Weather functionality module
│   │   ├── weather.controller.ts
│   │   ├── weather.routes.ts
│   │   ├── weather.service.ts
│   │   └── weather.types.ts
│   ├── media/                  # Media handling module
│   │   ├── media.controller.ts
│   │   ├── media.routes.ts
│   │   ├── media.service.ts
│   │   └── media.types.ts
│   └── hobby/                  # Hobbies module
│       ├── hobby.controller.ts
│       ├── hobbies.routes.ts
│       ├── hobbies.ts
│       └── hobby.types.ts
├── shared/                     # Shared utilities and configurations
│   ├── middleware/             # Shared middleware
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   └── validation.middleware.ts
│   ├── utils/                  # Shared utilities
│   │   ├── logger.util.ts
│   │   ├── sanitizeInput.util.ts
│   │   └── storage.ts
│   └── config/                 # Configuration files
│       └── database.ts
├── routes.ts                   # Main router configuration
├── index.ts                    # Application entry point
└── uploads/                    # File uploads directory
```

## Module Organization

### 1. **Auth Module** (`modules/auth/`)
- Handles user authentication and authorization
- Google OAuth integration
- JWT token management

### 2. **User Module** (`modules/user/`)
- User profile management
- User data models and schemas
- User-related business logic

### 3. **Weather Module** (`modules/weather/`)
- Weather data fetching from OpenWeatherMap API
- Saved cities management
- Weather recommendations based on hobbies

### 4. **Media Module** (`modules/media/`)
- File upload handling
- Image processing and storage
- Media-related utilities

### 5. **Hobby Module** (`modules/hobby/`)
- Hobby management and validation
- Hobby-related constants and utilities

### 6. **Shared Resources** (`shared/`)
- **Middleware**: Authentication, validation, error handling
- **Utils**: Logging, input sanitization, file storage
- **Config**: Database configuration and connection

## Benefits of This Structure

1. **Modularity**: Each feature is self-contained in its own module
2. **Scalability**: Easy to add new features without affecting existing code
3. **Maintainability**: Clear separation of concerns and responsibilities
4. **Reusability**: Shared utilities can be used across modules
5. **Testability**: Each module can be tested independently
6. **Team Collaboration**: Different developers can work on different modules

## Import Paths

All imports have been updated to reflect the new structure:

```typescript
// Before
import { userModel } from './user.model';
import logger from './logger.util';

// After
import { userModel } from '../user/user.model';
import logger from '../../shared/utils/logger.util';
```

## API Endpoints

The API endpoints remain unchanged:
- `/api/auth/*` - Authentication routes
- `/api/user/*` - User management routes
- `/api/weather/*` - Weather-related routes
- `/api/media/*` - Media upload routes
- `/api/hobbies/*` - Hobby management routes

## Development Guidelines

1. **New Features**: Create new modules in the `modules/` directory
2. **Shared Code**: Place reusable code in the `shared/` directory
3. **Module Dependencies**: Use relative imports to reference other modules
4. **Consistent Structure**: Follow the established pattern for each module (controller, routes, service, types)