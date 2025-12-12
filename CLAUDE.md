# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pose Calendar** is a web application for content creators (specifically for The Sims 4 pose pack creators) to manage releases, organize files, track tasks, and prepare social media posts across multiple platforms (Telegram, VK, Boosty, Tumblr).

The application allows users to:
- Plan pose pack releases using a visual calendar
- Store and manage pack files (covers, screenshots, archives)
- Track preparation tasks via checklists
- Manage release status per platform
- Create draft posts for different social media platforms

## Architecture

This is a full-stack application with separate frontend and backend:

### Backend (Spring Boot + PostgreSQL)
- **Location**: `backend/pose-calendar-backend/`
- **Stack**: Java 21, Spring Boot 3.5.8, Spring Security, Spring Data JPA, PostgreSQL 16, Lombok
- **Auth**: JWT-based authentication (io.jsonwebtoken 0.12.6)
- **File Storage**: Local filesystem with abstraction layer (can be switched to S3-compatible storage like Yandex Object Storage)
- **File Upload Limits**: 40MB per file and per request (configured in application.yml)
- **Build Tool**: Maven with wrapper scripts (`./mvnw` or `mvnw.cmd`)
- **Package structure** (`src/main/java/com/posecalendar/`):
  - `auth/` - Authentication (login, JWT tokens)
  - `user/` - User management
  - `pack/` - Core Pack entity with files, tasks, platform statuses, and post drafts
  - `release/` - Release scheduling with calendar management
  - `platform/` - Platform enum (TELEGRAM, VK, BOOSTY, TUMBLR)
  - `storage/` - File storage abstraction layer
  - `security/` - JWT filters and security config
  - `config/` - Application configuration beans
  - `health/` - Health check endpoints (Spring Boot Actuator)

### Frontend (React + TypeScript + Vite)
- **Location**: `frontend/`
- **Stack**: React 18, TypeScript, Vite, React Router 7, TanStack Query (React Query), Mantine UI, Axios
- **Structure** (feature-based, located in `src/`):
  - `app/` - Root component and routing setup
  - `features/` - Feature modules:
    - `auth/` - Authentication context, login, protected routes
    - `packs/` - Pack management components and API hooks
    - `layout/` - Layout components (sidebar, context panels)
  - `pages/` - Page components (LoginPage, AppPage)
  - `layout/` - Main layout wrapper (AppLayout)
  - `shared/` - Shared utilities and API client configuration

### Database

PostgreSQL 16 with JPA/Hibernate managing schema. Key entities:
- `User` - Application users with JWT authentication
- `Pack` - Pose packs with type (SOLO/COUPLE/ALL_IN_ONE), status, and metadata
- `PackFile` - Files associated with packs (COVER, SCREENSHOT, ARCHIVE, etc.)
- `PackTask` - Checklist items for pack preparation
- `PackPlatform` - Platform-specific status, planned/published dates, and notes for each pack
- `Release` - Scheduled releases linked to packs for calendar management
- `PostDraft` - Draft posts for social media platforms (title, body, hashtags, language)

## Development Commands

### Backend

Navigate to `backend/pose-calendar-backend/` for all backend operations.

**Database setup:**
```bash
docker-compose up -d
```
This starts PostgreSQL on port 5432 with database `pose_calendar_dev`.

**Build and run:**
```bash
mvn clean install
mvn spring-boot:run
```
Or using Maven wrapper:
```bash
./mvnw clean install
./mvnw spring-boot:run
```

**Run tests:**
```bash
mvn test
# Or: ./mvnw test
```

**Compile only:**
```bash
mvn clean compile
# Or: ./mvnw clean compile
```

Backend runs on `http://localhost:8080` by default.

**Configuration**: `src/main/resources/application.yml`
- Database credentials: `pose_calendar` / `pose_calendar`
- JWT secret configured in `posecalendar.security.jwt.secret` (30 days expiration)
- File storage path: `./storage` (relative to backend directory)
- File upload limits: 40MB per file and per request
- Spring Boot Actuator enabled for health checks

**Health check endpoint:**
```bash
curl http://localhost:8080/actuator/health
```

### Frontend

Navigate to `frontend/` for all frontend operations.

**Install dependencies:**
```bash
npm install
```

**Development server:**
```bash
npm run dev
```
Runs on `http://localhost:5173` by default with hot reload.

**Build for production:**
```bash
npm run build
```
Outputs to `frontend/dist/`. TypeScript checking runs before build.

**Lint:**
```bash
npm run lint
```

**Preview production build:**
```bash
npm run preview
```

**Environment variables:**
- `VITE_API_BASE_URL` - Backend API URL (defaults to `http://localhost:8080`)

## Key Implementation Details

### Authentication Flow
1. User logs in via `/api/auth/login` (POST with email/password)
2. Backend returns JWT token and user info
3. Frontend stores token in localStorage (`pose-calendar/token`)
4. Axios interceptor automatically adds `Authorization: Bearer {token}` to all requests
5. Protected routes check authentication via `AuthContext` and `ProtectedRoute` component

### File Upload Flow
Files are uploaded to `/api/packs/{packId}/files` and stored via the storage abstraction layer. Backend returns file metadata including storage path/URL. Frontend can download files via `/api/packs/{packId}/files/{fileId}/download`. Maximum file size is 40MB per file and 40MB per request (configured in `spring.servlet.multipart`).

### Platform Management Flow
Each pack can have multiple platform-specific statuses managed through the `PackPlatform` entity:
1. Platform status is one of: `DRAFT`, `SCHEDULED`, `PUBLISHED`, `ARCHIVED`
2. Each platform has planned and actual publication dates
3. Post drafts (title, body, hashtags, language) are managed per platform
4. The `Pack` entity maintains a list of `PackPlatform` entities with a unique constraint on `(pack_id, platform)`

### State Management
- No Redux - using TanStack Query for server state
- React Context for authentication state
- Mantine's built-in state for UI components

### API Communication
- Base URL configured in `frontend/src/shared/api/httpClient.ts`
- All API calls use the configured axios instance with JWT interceptor
- 401 responses trigger logout warning (can be enhanced for automatic logout)

## Common Patterns

### Backend
- **DTOs**: Separate request/response DTOs in `dto/` subdirectories
- **Mappers**: Convert between entities and DTOs (e.g., `PackMapper`)
- **Services**: Business logic layer, injected into controllers
- **Repositories**: Spring Data JPA interfaces with custom queries
- **Controllers**: REST endpoints with `@RestController` and `@RequestMapping`
- **Entities**: Use Lombok annotations (`@Data`, `@Builder`, `@Entity`) and JPA auditing (`@CreatedDate`, `@LastModifiedDate`)
- **Validation**: Jakarta validation annotations on DTOs (`@Size`, `@NotNull`, etc.)

### Frontend
- **API hooks**: Custom hooks using TanStack Query (e.g., `usePacksQuery`, `useCreatePackMutation`)
- **Components**: Functional components with TypeScript interfaces for props
- **Routing**: React Router with layout wrapper and protected routes
- **Forms**: Mantine form components with validation

## Storage Directory

The `storage/` directory at project root contains uploaded files. This is created at runtime and ignored by git. Backend configuration maps to `./storage` relative to backend directory, but it actually resolves to the project root `storage/` folder.

## Documentation

Additional documentation is available in `docs.notion-export/` including:
- Project specification (`pose-calendar-spec-v1`)
- Development plan (`pose-calendar-plan-v1`)
- Frontend and backend architecture details
- Business requirements and mockups (in Russian)

## Important Notes

- JWT secret in `application.yml` is a dev placeholder - should be externalized for production
- JWT token expiration is set to 30 days (43200 minutes)
- Database credentials are hardcoded for dev - use environment variables in production
- File storage is local filesystem by default - can be swapped for S3-compatible storage
- File upload size limit is 40MB per file - increase if needed for large archives
- The application supports multiple users but is primarily designed for small creator teams (1-100 users)
- Spring DevTools is currently commented out in `pom.xml`
- Hibernate DDL auto is set to `update` for dev - use migrations (Flyway/Liquibase) for production
- SQL logging is enabled in dev mode (`show-sql: true`) for debugging
