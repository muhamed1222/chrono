# Chrono

**Chrono** — веб‑приложение для планирования и организации публикаций в социальных сетях. Оно позволяет собирать клиентов, хранить шаблоны контента и управлять расписанием постов через календарь.

## Основные функции

- Регистрация и авторизация пользователей через Supabase
- Список клиентов с привязкой их социальных аккаунтов
- Создание и редактирование постов с медиафайлами
- Планирование публикаций на нужные даты и платформы
- Хранение шаблонов постов для быстрого повторного использования

## Установка

### Требования
- Node.js 18+ и npm

### Шаги
1. Установите зависимости:
   ```bash
   npm install
   ```
   Это также устанавливает пакеты разработки, необходимые для
   запуска тестов и линтера.
2. Создайте файл `.env` на основе примера `.env.example` и пропишите переменные окружения.
3. Запустите проект в режиме разработки:
   ```bash
   npm run dev
   ```
4. Запустите сервер API:
   ```bash
   npm run start:api
   ```
5. Для сборки production-версии выполните:
   ```bash
   npm run build
   ```
6. Проверьте код линтером:
   ```bash
   npm run lint
   ```

## Переменные окружения

Для подключения к Supabase необходимо задать следующие переменные в `.env`:

- `VITE_SUPABASE_URL` — адрес проекта Supabase
- `VITE_SUPABASE_ANON_KEY` — публичный ключ (Anon Key)
- `VITE_SUPABASE_STORAGE_BUCKET` — имя бакета Supabase Storage (по умолчанию `media`)
- `VITE_INACTIVITY_TIMEOUT_MINUTES` — время бездействия до авторазлогина в минутах (например, `0`)

Если после запуска приложение показывает пустой экран, скорее всего, не заданы
обязательные переменные `.env`. Отсутствие любой из этих переменных может
вызвать ошибку во время выполнения, и в консоли появится сообщение "Missing
Supabase environment variables".

## Пример `.env.example`

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_STORAGE_BUCKET=media
VITE_INACTIVITY_TIMEOUT_MINUTES=0
```

## Database setup

If the project isn't linked to your Supabase instance yet, run:

```bash
supabase link
```

To initialize the database from scratch, execute:

```bash
supabase db reset
```

This command uses the migration scripts located in `supabase/migrations/` to
recreate the schema. When you only need to apply new migrations, run:

```bash
supabase migration up
```

## UI Components

В каталоге `src/components/ui` находятся базовые компоненты интерфейса:

- `Button` — стандартная кнопка с вариантами `primary`, `secondary` и `link`.
- `Input` — текстовое поле с преднастроенными стилями.

Эти компоненты используются для единообразного оформления элементов управления.

## Testing

### Unit tests (Jest)
Запустите модульные тесты командой:
```bash
npm run test
```

### End-to-end tests (Cypress)
Перед запуском убедитесь, что локальный сервер запущен на http://localhost:5173  (npm run dev).

Запустите тесты с Cypress командой:
```bash
npm run test:e2e
```

