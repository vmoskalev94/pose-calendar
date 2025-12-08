# pose-calendar-plan-v1

Owner: mv_vm
Number: 70

# Pose Calendar — план реализации (v1)

## 0. Как использовать этот план в новом чате

1. Сначала пришли ассистенту файл `pose-calendar-spec-v1.md`.
2. Затем этот файл.
3. Напиши что-то вроде:
    
    > "Мы уже сделали шаги 0 и 1.1–1.2. Сейчас нужно выполнить шаг 1.3. Помоги реализовать этот этап."
    > 
4. В течение этапа:
    - Сначала попроси ассистента **описать шаги и файлы**, которые нужно поменять.
    - Потом — сгенерировать/править код.
    - После успешного запуска/тестирования пометь у себя этот шаг как выполненный.

---

## 1. Этап 0 — Инфраструктура (общий скелет)

**Цель:** рабочий монорепозиторий, пустой backend и frontend, всё стартует.

### 0.1. Монорепо

- [x]  Создан репозиторий `pose-calendar/`.
- [x]  Папки `backend/` и `frontend/`.
- [x]  Настроен `.gitignore`.

### 0.2. Backend скелет

- [x]  Spring Boot проект в `backend/pose-calendar-backend`.
- [x]  Зависимости: Web, JPA, PostgreSQL, Security, Validation (Lombok — опционально).
- [ ]  Настроен `application.yml` (dev-профиль) + Docker Compose с Postgres.
- [ ]  Простой контроллер `/api/health` (GET → 200 "OK").

### 0.3. Frontend скелет

- [x]  Vite + React + TS в `frontend/`.
- [x]  Установлены `react-router-dom`, `@tanstack/react-query`, `axios`, Mantine.
- [ ]  Настроены провайдеры в `main.tsx` (React Query, Mantine, Router).
- [ ]  Базовый роутинг: `/login`, `/app` + заглушки страниц.

---

## 2. Этап 1 — Бэкенд: Пользователи и авторизация

**Цель:** можно создать пользователя вручную и логиниться через `/api/auth/login`, фронт получает JWT.

### 1.1. Сущность User и Role

- [ ]  Создать пакет `user`:
    - `User` entity.
    - `Role` enum.
    - `UserRepository`.
- [ ]  Добавить базовые поля + `createdAt/updatedAt` (либо через `@MappedSuperclass` `BaseEntity`).

### 1.2. Настройка безопасности

- [ ]  Пакет `security`:
    - JWT-фильтр, `JwtTokenProvider`.
    - `SecurityConfig` (Spring Security).
- [ ]  Открытые пути: `/api/auth/**`, `/api/health`.
- [ ]  Закрытые: все остальные `/api/**`.

### 1.3. Auth-контроллер

- [ ]  Пакет `auth`:
    - `AuthController` с `/api/auth/login`.
    - DTO `LoginRequest`, `LoginResponse`.
- [ ]  Сервис для валидации пользователя, проверки пароля, выдачи JWT.
- [ ]  Эндпоинт `/api/auth/me` — возвращает инфо о текущем пользователе.

### 1.4. Бутстрап администратора

- [ ]  В dev-профиле создать одного пользователя (например, через CommandLineRunner):
    - email: `admin@example.com`
    - password: `admin` (только для dev).
- [ ]  Проверить логин через Postman/curl.

---

## 3. Этап 2 — Frontend: логин и базовый layout

**Цель:** есть рабочий фронт, который:

- показывает `/login`,
- отправляет логин на бэкенд,
- сохраняет JWT,
- переходит в `/app` (layout с сайдбаром, шапкой, заглушкой календаря и правой панелью).

### 2.1. Провайдеры и роутер

- [ ]  В `main.tsx`:
    - настроить `QueryClientProvider`, `MantineProvider`, `BrowserRouter`.
- [ ]  В `app/router.tsx`:
    - маршруты `/login`, `/app`, .
- [ ]  `AppLayout` с `Sidebar`, `TopBar`, `<Outlet />`.

### 2.2. Auth API и LoginForm

- [ ]  `shared/api/http.ts` — axios-инстанс с базовым URL `/api` и interceptor для JWT.
- [ ]  `features/auth/api`:
    - функция `login(credentials)`.
    - функция `getMe()`.
- [ ]  `features/auth/model/useAuth` (или контекст) — хранение пользователя и токена.
- [ ]  `LoginForm`:
    - форма email+password,
    - onSubmit → запрос к `/api/auth/login`,
    - при успехе: сохранить токен, запросить `/api/auth/me`, редирект на `/app`.

### 2.3. Protected routes

- [ ]  Защитить `/app`:
    - если нет токена → редирект на `/login`.
    - если токен есть, но `/me` не проходит → logout и на `/login`.

### 2.4. Каркас экрана календаря

- [ ]  `CalendarPageLayout`:
    - слева `CalendarGrid` (заглушка).
    - справа `UpcomingPanel` (заглушка с табами «Паки/Релизы»).
- [ ]  Простой UI, без реальных данных.

---

## 4. Этап 3 — Бэкенд: Паки (без файлов)

**Цель:** CRUD для паков, чек-лист генерируется автоматически, API готов для фронта.

### 3.1. Сущности Pack, PackTask

- [ ]  Пакет `packs/model`:
    - `Pack`, `PackStatus`, `PackType`.
    - `PackTask`, `PackTaskType`.
- [ ]  Пакет `packs/repository`:
    - `PackRepository`.
    - `PackTaskRepository`.

### 3.2. PackService

- [ ]  Сервис с методами:
    - `createPack(CreatePackCommand)` – создаёт Pack + дефолтные PackTask.
    - `updatePack(...)`, `deletePack(...)`.
    - `getPack(id)`, `listPacks(ownerId)`.

### 3.3. PackController + DTO

- [ ]  REST API:
    - `GET /api/packs` – список паков.
    - `GET /api/packs/{id}` – детали.
    - `POST /api/packs` – создать.
    - `PUT /api/packs/{id}` – изменить.
    - `DELETE /api/packs/{id}` – удалить.
    - `GET /api/packs/{id}/tasks` – чеклист.
    - `PATCH /api/packs/tasks/{taskId}` – изменить флаг `completed`.

---

## 5. Этап 4 — Frontend: Паки (без файлов)

**Цель:** правая панель «Паки» работает с реальным API, карточка пака открывается.

### 4.1. Pack API и типы

- [ ]  `features/packs/model` — TS-типы `Pack`, `PackTask`.
- [ ]  `features/packs/api` — хуки:
    - `usePacksQuery`.
    - `usePackQuery(id)`.
    - `useCreatePackMutation`, `useUpdatePackMutation`, `useDeletePackMutation`.
    - `usePackTasksQuery(id)`, `useToggleTaskMutation`.

### 4.2. UI компонентов

- [ ]  `PackShortCard` — короткая карточка для правой панели.
- [ ]  `PackDetailsModal` — полная карточка с основной информацией + чеклист (без файлов пока).
- [ ]  `PackForm` — форма создания/редактирования пака.

### 4.3. Интеграция с правой панелью

- [ ]  В `UpcomingPanel`:
    - вкладка «Паки» → список из `usePacksQuery`.
    - клик по карточке → `PackDetailsModal`.
    - кнопка «Создать новый пак».

---

## 6. Этап 5 — Бэкенд: Файлы пака + хранилище

**Цель:** реализовать `PackFile` и интеграцию с FileStorageService.

### 5.1. FileStorageService

- [ ]  Интерфейс `FileStorageService` + `StoredFile`.
- [ ]  Реализация `LocalFileStorageService`:
    - базовый путь из конфига.
    - методы `save`, `load`, `delete`.
- [ ]  Конфигурация бина в Spring.

### 5.2. PackFile сущность и API

- [ ]  `PackFile` entity + `PackFileRepository`.
- [ ]  REST:
    - `POST /api/packs/{id}/files` (multipart) — загрузка файла.
    - `GET /api/packs/{id}/files` — список.
    - `GET /api/packs/files/{fileId}` — скачивание.
    - `DELETE /api/packs/files/{fileId}` — удаление.

---

## 7. Этап 6 — Frontend: Файлы пака

**Цель:** в карточке пака можно загружать/смотреть/удалять файлы.

### 6.1. API и типы

- [ ]  TS-тип `PackFile`.
- [ ]  Хуки:
    - `usePackFilesQuery(packId)`.
    - `useUploadPackFileMutation`.
    - `useDeletePackFileMutation`.

### 6.2. UI

- [ ]  `PackFilesSection`:
    - блок "Обложка" (одна обложка, можно заменить).
    - блок "Скриншоты" (список превью, добавить/удалить).
    - блок "Архив" (кнопка загрузить/скачать).
- [ ]  Интеграция в `PackDetailsModal`.

---

## 8. Этап 7 — Бэкенд: Релизы, платформы, посты

**Цель:** сущности Release, ReleasePlatform, PostDraft + API для календаря.

### 7.1. Модель и репозитории

- [ ]  `Release`, `ReleaseStatus`.
- [ ]  `ReleasePlatform`, `ReleasePlatformStatus`.
- [ ]  `PostDraft`.
- [ ]  Репозитории для всех.

### 7.2. Сервисы и контроллеры

- [ ]  `ReleaseService`:
    - создание/редактирование/удаление,
    - выборка по диапазону дат.
- [ ]  REST:
    - `GET /api/releases?fromDate=...&toDate=...`
    - `GET /api/releases/{id}`
    - `POST /api/releases`
    - `PUT /api/releases/{id}`
    - `DELETE /api/releases/{id}`
- [ ]  REST для платформ:
    - `GET /api/releases/{id}/platforms`
    - `PUT /api/releases/platforms/{platformId}`.
- [ ]  REST для постов:
    - `GET /api/platforms/{releasePlatformId}/post-draft`
    - `PUT /api/platforms/{releasePlatformId}/post-draft`.

---

## 9. Этап 8 — Frontend: Календарь и релизы

**Цель:** полный календарный UI с релизами и модалками, статусы по платформам и черновики постов.

### 8.1. CalendarGrid

- [ ]  Реализовать реальный календарь:
    - расчёт дней месяца,
    - отображение релизов по дням.
- [ ]  Клики:
    - по дню → `ReleaseFormModal` (создание).
    - по релизу → `ReleaseViewModal`.

### 8.2. Release UI

- [ ]  `ReleaseCard` для правой панели.
- [ ]  `ReleaseViewModal` — просмотр, переход к паку.
- [ ]  `ReleaseFormModal` — создание/редактирование.

### 8.3. Платформы и посты

- [ ]  В `ReleaseViewModal`:
    - чекбоксы/статусы по платформам.
    - кнопки «редактировать текст поста» → открыть редактор `PostDraft`.
- [ ]  UI для редактирования текстов постов (в рамках модалки или отдельной секции).

---

## 10. Этап 9 — Деплой и полировка

**Цель:** приложение поднято на VPS, доступ только по логину.

- [ ]  Docker Compose:
    - backend + postgres (и, опционально, reverse-proxy).
    - настройки для prod-профиля (база, пути хранилища файлов).
- [ ]  Настройка CORS для фронта с VPS-домена.
- [ ]  Тестовый юзер и проверка полного флоу:
    - логин → создание пака → чеклист → файлы → релиз → календарь.

---