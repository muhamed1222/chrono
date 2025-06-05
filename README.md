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
2. Создайте файл `.env` на основе примера `.env.example` и пропишите переменные окружения.
3. Запустите проект в режиме разработки:
   ```bash
   npm run dev
   ```
4. Для сборки production-версии выполните:
   ```bash
   npm run build
   ```
5. Проверьте код линтером:
   ```bash
   npm run lint
   ```

## Переменные окружения

Для подключения к Supabase необходимо задать следующие переменные в `.env`:

- `VITE_SUPABASE_URL` — адрес проекта Supabase
- `VITE_SUPABASE_ANON_KEY` — публичный ключ (Anon Key)

Если после запуска приложение показывает пустой экран, скорее всего, не заданы
обязательные переменные `.env`.

## Пример `.env.example`

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
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

