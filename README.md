# Pose Calendar

Локальное web-приложение-календарь для планирования выходов паков поз для **The Sims 4**  
(планы релизов для Telegram / VK / Boosty / Tumblr и др.).

---

## 1. Текущий статус

Сейчас реализован **Этап 0 — Скелет проекта**:

- Back-end: Spring Boot 3, Java 21, Gradle (Kotlin DSL).
- База данных:
    - `dev` — H2 (file mode, режим совместимости с PostgreSQL).
    - `prod` — PostgreSQL (через Docker Compose).
- Migrations: Flyway, первая миграция `V1__init_app_info.sql`.
- Front-end: Vite + React + TypeScript, страница с заглушкой календаря.
- Связь фронта и бэка:
    - `GET /api/health` — простой health-check.
    - Vite proxy на `/api/**` → `http://localhost:8080`.
- Docker:
    - `Dockerfile` для back-end.
    - `docker-compose.yml` для `app` (Spring Boot) + `db` (Postgres).

Далее на **Этапе 1 (MVP-календарь)** будет добавлена доменная модель (Pack/Release/Checklist), API и настоящий календарь.

---

## 2. Технологический стек

**Backend**

- Java 21
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Flyway
- H2 Database (dev)
- PostgreSQL (prod)
- Lombok

**Frontend**

- Vite
- React
- TypeScript

**Инфраструктура**

- Docker
- Docker Compose

---

## 3. Структура проекта

```text
pose-calendar/
  backend/              # (если используется многомодульная структура)
  build.gradle.kts
  settings.gradle.kts
  src/
    main/
      java/
      resources/
        application.yml
        application-dev.yml
        application-prod.yml
        db/
          migration/
            V1__init_app_info.sql
  frontend/
    package.json
    vite.config.ts
    src/
      main.tsx
      App.tsx
      ...
  Dockerfile
  docker-compose.yml
  .dockerignore
  README.md
