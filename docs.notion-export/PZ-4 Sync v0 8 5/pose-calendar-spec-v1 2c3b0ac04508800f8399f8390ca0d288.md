# pose-calendar-spec-v1

Owner: mv_vm
Number: 60

# Pose Calendar — спецификация проекта (v1)

## 0. Как использовать эту спецификацию в новом чате

1. Скопируй и вставь этот файл в новый чат (можно частями, если лимит).
2. Сразу после этого пришли ассистенту второй файл `pose-calendar-plan-v1.md`.
3. Затем напиши, на каком шаге плана вы сейчас (например: "Мы на этапе 2.3 — реализуем сущность Pack на бэкенде. Продолжай с этого места").

---

## 1. Общая идея и контекст

**Проект:** Pose Calendar – веб-приложение для управления релизами контента по The Sims 4 (паки поз, скриншоты, посты для соцсетей).

**Основной пользователь:** контент-криэйтор (автор поз), в первую очередь Aylin Moss.

**Задача:**

- Планировать релизы паков поз по датам/времени.
- Хранить информацию о паках и связанных файлах (обложки, скрины, архивы с позами).
- Вести чек-лист по подготовке пака.
- Готовить черновики постов для разных площадок (Telegram, VK, Boosty, Tumblr).
- Всё это — через удобный UI с календарём, без ручного управления файлами в проводнике.

---

## 2. Как выглядит текущий процесс у креатора

Контент публикуется на нескольких платформах:

- **Telegram** – карточки с обложкой, коллажами поз, описанием, ссылкой на инструкцию/скачивание.
- **VK** – похожие посты, иногда с каруселью картинок.
- **Boosty** – более подробные посты: описание, условия доступа, инструкции, файлы для скачивания.

Типичный пост содержит:

- Обложку пака.
- Коллаж из нескольких поз/скриншотов.
- Название пака.
- Кол-во поз, тип (solo/couple/all-in-one).
- Краткое тематическое описание.
- Информацию о доступе (free/ранний доступ/для подписчиков).
- Ссылку на инструкцию/скачивание.
- Хэштеги (наборы для разных площадок).

Проблемы без приложения:

- Плохо видно, **когда** какой пак выходит.
- Легко забыть шаги: протестировать позы, сделать скрины, собрать архив, подготовить посты для всех площадок.
- Файлы (обложки, скриншоты, архивы) лежат в разных папках на диске без связки с календарём.

---

## 3. Цели и нефункциональные требования

### 3.1. Цели

- Визуальный **календарь релизов** с месяцем и днями.
- Привязка релизов к **пакам** (один релиз → один пак).
- Хранилище файлов для пака (обложки, скрины, архивы).
- Чек-лист подготовки пака (создать позы, протестировать, сделать скрины и т.д.).
- Состояние релиза по **платформам** (готов ли пост для TG/VK/Boosty/Tumblr).
- Минимальная многопользовательская модель (1–100 пользователей).
- Доступ только через логин.

### 3.2. Нефункциональные

- Backend: Java + Spring Boot + PostgreSQL.
- Frontend: React + TypeScript + Vite + React Router + React Query + Mantine UI.
- Хранение файлов:
    - сначала локальная файловая система;
    - позже можно переключить на Yandex Object Storage (S3-совместимое).
- Docker Compose (минимум: backend + postgres; позже можно добавить nginx, minio/YOS).
- Архитектура: слои (Controller → Service → Repository), file storage через абстракцию.

---

## 4. UX и экраны (по макетам)

### 4.1. Главный экран — календарь

Разметка:

- **Левый сайдбар** (статичный):
    - Логотип/название приложения.
    - Пункты меню:
        - Calendar (основной экран).
        - Packs (позже).
        - Analytics (позже).
    - Внизу:
        - Информация о пользователе (минимум — email/имя).
        - Настройки (на будущее).
        - Logout.
- **Центр** — календарь **Month view**:
    - Сетка: дни недели по горизонтали, недели по вертикали.
    - В шапке:
        - Название месяца и год (`December 2025`).
        - Левые/правые стрелки навигации по месяцам.
    - В каждой ячейке:
        - Номер дня.
        - Список релизов в этот день в виде небольших бейджей (`название релиза + статус`).
    - Клик по "телу" дня:
        - Открывает модалку создания релиза на этот день.
    - Клик по релизу:
        - Открывает модалку просмотра/редактирования релиза.
- **Правая панель ("Следующие события")**:
    - Вкладки:
        - **Паки** — список созданных паков.
        - **Релизы** — ближайшие релизы (по дате).
    - В режиме «Паки»:
        - Карточки паков: название, статус, базовая инфа.
        - Клик по карточке → полная карточка пака (модалка).
        - Кнопка «Создать новый пак».
    - В режиме «Релизы»:
        - Список по датам: "Дата ... + краткая карточка релиза".
        - Кнопка «Запланировать новый релиз».

### 4.2. Полная карточка пака

Открывается по клику на короткую карточку.

Поля:

1. **Название пака на RU**.
2. Название на EN.
3. Дата релиза (если есть основной релиз).
4. Тип (solo/couple/mixed/other).
5. Теги/хэштеги.
6. Статус пака (idea/in progress/ready/released/archived).
7. **Файлы**:
    - Обложка (одна или несколько).
    - Скриншоты (коллажи, отдельные скрины).
    - Архив (.package/.zip).
    - Дополнительные файлы (инструкции и т.п.).
    - Для каждого файла —
        - отображение превью/иконки,
        - кнопки: заменить / скачать / удалить.
8. **Чек-лист** (фиксированный список шагов):
    - Сделать позы.
    - Протестировать в игре.
    - Сделать скриншоты.
    - Сделать обложку.
    - Подготовить текст поста.
    - Собрать .package / архив.
    - Подготовить пост для Telegram.
    - Подготовить пост для VK.
    - Подготовить пост для Boosty.
    - Подготовить пост для Tumblr.
9. Кнопки закрытия/удаления пака.

### 4.3. Карточка релиза

Есть два состояния: просмотр и создание/редактирование.

**Просмотр релиза**:

- Название релиза.
- Дата (`dd.MM.yy`).
- Время (`HH:mm`).
- Пак: название (кликабельно → перейти в карточку пака).
- Платформы:
    - Чекбоксы или индикаторы для TG/Boosty/VK/Tumblr.
    - Статусы по платформам (планируется/черновик/опубликовано).
- Кнопки:
    - Редактировать.
    - Удалить.
    - Закрыть.

**Создание/редактирование релиза**:

- Поля:
    - Название.
    - Дата (по умолчанию — выбранный день в календаре, но можно изменить).
    - Время.
    - Пак (выбор из списка существующих паков).
    - Платформы (чекбоксы).
- После сохранения:
    - Релиз появляется в клетке календаря как бейдж.
    - Попадает в правую панель «Релизы».

---

## 5. Техническая архитектура

### 5.1. Стек

- **Backend**: Java, Spring Boot, Spring Web, Spring Data JPA, Spring Security, Validation, PostgreSQL.
- **Frontend**: React, TypeScript, Vite, React Router, React Query (TanStack), Mantine UI.
- **Database**: PostgreSQL.
- **File storage**:
    - v1: локальная файловая система сервера (например `/data/pose-calendar/...`).
    - v2: Yandex Object Storage (S3-совместимое хранилище).
- **Docker Compose** для локального и серверного запуска.

### 5.2. Структура репо (монорепозиторий)

```
pose-calendar/
  backend/
    pose-calendar-backend/
      pom.xml
      src/main/java/...
      src/main/resources/...
  frontend/
    package.json
    vite.config.ts
    src/...
  docker-compose.yml  (потом)
  README.md

```

## 6. Доменная модель (backend)

### 6.1. Пользователь и авторизация

**User**

- `id: UUID`
- `email: String` (уникальный)
- `displayName: String`
- `passwordHash: String`
- `role: Role` (enum: `ADMIN`, `USER`)
- `createdAt`, `updatedAt`

**Role (enum)**

`ADMIN`, `USER`.

Аутентификация: **JWT + Spring Security**.

Эндпоинты: `/api/auth/login`, `/api/auth/me`.

Все остальные `/api/**` — защищены.

---

### 6.2. Платформы

**Platform (enum)**

- `TELEGRAM`
- `VK`
- `BOOSTY`
- `TUMBLR`

Используется в релизах и постах.

---

### 6.3. Пак (Pack)

**Pack**

- `id: UUID`
- `owner: User`
- `titleRu: String`
- `titleEn: String`
- `description: String`
- `packType: PackType` (`SOLO`, `COUPLE`, `GROUP`, `OTHER`)
- `status: PackStatus` (`IDEA`, `IN_PROGRESS`, `READY`, `RELEASED`, `ARCHIVED`)
- `hashtags: String` (сырой набор тегов)
- `poseCount: Integer`
- `hasAllInOne: boolean`
- `notes: String`
- `createdAt`, `updatedAt`

**PackType (enum)**

`SOLO`, `COUPLE`, `GROUP`, `OTHER`.

**PackStatus (enum)**

`IDEA`, `IN_PROGRESS`, `READY`, `RELEASED`, `ARCHIVED`.

---

### 6.4. Файлы пака

**PackFile**

- `id: UUID`
- `pack: Pack`
- `fileType: PackFileType`:
    - `COVER`
    - `PREVIEW`
    - `SCREENSHOT`
    - `ARCHIVE`
    - `INSTRUCTION`
    - `EXTRA`
- `storagePath: String` – путь/ключ в хранилище
- `originalFilename: String`
- `contentType: String`
- `sizeBytes: long`
- `createdAt`

**PackFileType (enum)**

как выше.

---

### 6.5. Чек-лист пака

**PackTask**

- `id: UUID`
- `pack: Pack`
- `taskType: PackTaskType`
- `customTitle: String` (опционально)
- `completed: boolean`
- `orderIndex: int`

**PackTaskType (enum)** (по макету):

- `CREATE_POSES`
- `TEST_IN_GAME`
- `MAKE_SCREENSHOTS`
- `MAKE_COVER`
- `PREPARE_POST_TEXT`
- `BUILD_PACKAGE_ARCHIVE`
- `PREPARE_POST_TELEGRAM`
- `PREPARE_POST_VK`
- `PREPARE_POST_BOOSTY`
- `PREPARE_POST_TUMBLR`

При создании `Pack` сервис автоматически создаёт стандартный набор `PackTask`.

---

### 6.6. Релизы и календарь

**Release**

- `id: UUID`
- `owner: User`
- `title: String`
- `pack: Pack`
- `releaseDateTime: LocalDateTime`
- `status: ReleaseStatus` (`PLANNED`, `CONTENT_READY`, `POSTED`, `CANCELLED`)
- `notes: String`
- `createdAt`, `updatedAt`

**ReleaseStatus (enum)**

`PLANNED`, `CONTENT_READY`, `POSTED`, `CANCELLED`.

---

### 6.7. Платформенные статусы релиза

**ReleasePlatform**

- `id: UUID`
- `release: Release`
- `platform: Platform`
- `status: ReleasePlatformStatus`
- `plannedDateTime: LocalDateTime` (опционально)
- `publishedDateTime: LocalDateTime` (опционально)
- `notes: String`

**ReleasePlatformStatus (enum)**

`PLANNED`, `DRAFT_PREPARED`, `PUBLISHED`.

---

### 6.8. Черновики постов

**PostDraft**

- `id: UUID`
- `releasePlatform: ReleasePlatform` (0..1 на платформу)
- `title: String`
- `body: String`
- `hashtags: String`
- `language: String`
- `createdAt`, `updatedAt`

---

### 6.9. Хранилище файлов

**Интерфейс:**

```java
public interface FileStorageService {

    StoredFile save(InputStream data, String path, String contentType);

    InputStream load(String path);

    void delete(String path);
}

```

- **LocalFileStorageService** – реализация через файловую систему:
    - базовый путь: `storage.local.base-path=/data/pose-calendar`
- В будущем — **YandexObjectStorageService** (S3).

---

## 7. Архитектура frontend

### 7.1. Стек

- React + TypeScript + Vite.
- React Router.
- React Query.
- Mantine UI (основные компоненты: AppShell, Grid, Paper, Tabs, Modal, Form inputs).

### 7.2. Структура `frontend/src`

```
src/
  app/
    App.tsx
    router.tsx
    providers/
      (по необходимости)
  shared/
    api/
      http.ts (axios-инстанс)
    config/
    ui/
    types/
    lib/
  features/
    auth/
      components/
        LoginForm.tsx
      api/
      model/
    packs/
      components/
        PackShortCard.tsx
        PackDetailsModal.tsx
        PackForm.tsx
        PackFilesSection.tsx
        PackChecklistSection.tsx
      api/
      model/
    releases/
      components/
        ReleaseCard.tsx
        ReleaseViewModal.tsx
        ReleaseFormModal.tsx
      api/
      model/
    calendar/
      components/
        CalendarGrid.tsx
        CalendarDayCell.tsx
        CalendarHeader.tsx
      lib/
        (утилиты для дат)
  widgets/
    layout/
      AppLayout.tsx
      Sidebar.tsx
      TopBar.tsx
    calendar-page/
      CalendarPageLayout.tsx
      UpcomingPanel.tsx
  pages/
    LoginPage.tsx
    CalendarPage.tsx
    NotFoundPage.tsx
  main.tsx

```

### 7.3. Основная идея фронта

- `/login` – страница логина → запрос к `/api/auth/login`, получение JWT.
- `/app` – защищённый layout (AppShell):
    - Sidebar слева.
    - TopBar сверху.
    - Внутри — компоненты страниц, например `CalendarPage`.

**CalendarPage:**

- `CalendarPageLayout`:
    - слева `CalendarGrid` (month view),
    - справа `UpcomingPanel` (табы «Паки/Релизы»).
- `CalendarGrid` использует `useReleasesForMonth()` (через React Query).
- `UpcomingPanel` использует `usePacksQuery()` и `useUpcomingReleasesQuery()`.

Все данные тянутся из backend API.

---

## 8. Текущее состояние проекта (на момент spec v1)

- Создан монорепозиторий `pose-calendar`.
- Backend:
    - Spring Boot проект в `backend/pose-calendar-backend`.
    - Подключены базовые зависимости (Web, JPA, PostgreSQL, Security, Validation).
    - Пока нет доменных сущностей и контроллеров (реализация по плану).
- Frontend:
    - Vite + React + TS проект в `frontend/`.
    - Установлены:
        - `react-router-dom`
        - `@mantine/core`, `@mantine/hooks`, `@mantine/dates`, `dayjs`
        - `@tanstack/react-query`
        - `axios`
    - Стартовая структура готова (дальнейшая детализация по плану).