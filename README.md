# 📘 Chat App – документация

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load **Geist**, a font family for Vercel.

---

## 1. Обща информация

**Име на проекта:** Chat App
**Тип:** Full-stack уеб приложение
**Архитектура:** Monorepo (Frontend + Backend в Next.js)
**Цел:** Реализация на реално-време чат система с модерни уеб технологии.

---

## 2. Използвани технологии и тяхната роля

### 2.1 Frontend

* **Next.js 13 (App Router)** – routing, SSR, API routes
* **React + TypeScript** – компонентна архитектура и типова безопасност
* **TailwindCSS** – стилизиране на интерфейса

### 2.2 Backend

* **Next.js API Routes** – backend логика
* **Socket.io** – реално-време комуникация
* **Prisma ORM** – достъп до базата данни

### 2.3 База данни

* **PostgreSQL** – основна база данни
* **SQLite** – тестова база (само за автоматични тестове)

### 2.4 Допълнителни услуги

* **Clerk** – аутентикация и управление на потребители
* **UploadThing** – качване на файлове

### 2.5 Тестване

* **Jest** – unit и integration тестове
* **React Testing Library** – component тестове

---

## 3. Структура на проекта (детайлно)

```
chat-app/
│
├── app/                     # Next.js App Router
│   ├── api/                 # Backend API routes
│   │   ├── socket/          # Socket.io endpoint
│   │   └── ping/            # Test API route
│   ├── layout.tsx           # Главен layout + providers
│   └── page.tsx             # Начална страница
│
├── components/              # React компоненти
│   └── Chat/
│       ├── ChatInput.tsx    # UI за изпращане на съобщения
│       └── __tests__/       # Component тестове
│
├── lib/                     # Бизнес логика
│   ├── server.service.ts    # Помощни функции и правила
│   ├── __tests__/           # Unit тестове
│   └── db/
│       ├── message.service.ts # Prisma логика за Message
│       └── __tests__/       # Prisma тестове
│
├── prisma/                  # Prisma конфигурация
│   ├── schema.prisma        # Production schema
│   └── schema.test.prisma   # Test schema (SQLite)
│
├── jest.config.ts           # Jest конфигурация
├── jest.setup.ts            # Jest setup
├── package.json             # Dependencies + scripts
└── README.md                # Основно описание
```

---

## 4. Описание на ключови файлове

### 4.1 `app/layout.tsx`

Главен layout на приложението. Тук се инициализират:

* ClerkProvider (аутентикация)
* глобални стилове

### 4.2 `app/api/socket/route.ts`

API endpoint за Socket.io. Отговаря за:

* установяване на WebSocket връзка
* реално-време съобщения

### 4.3 `lib/server.service.ts`

Съдържа бизнес логика и правила, напр.:

* проверка на роли
* разрешения за действия

### 4.4 `lib/db/message.service.ts`

Инкапсулира Prisma заявки към таблицата `Message`:

* създаване на съобщения
* изолиране на DB логиката

---

## 5. Конфигурация на средата

### 5.1 `.env` файл

```env
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

Този файл не се качва в GitHub.

---

## 6. Prisma – настройване и работа

### Команди

```bash
npx prisma generate
npx prisma db push
```

* `generate` – генерира Prisma Client
* `db push` – синхронизира schema с базата

---

## 7. Тестване

### 7.1 Unit тестове

* Папка: `lib/__tests__`
* Тестват бизнес логиката

### 7.2 Prisma тестове

* Използва се SQLite база
* Файлове: `lib/db/__tests__`

### 7.3 Component тестове

* Папка: `components/**/__tests__`
* Тестват React компоненти изолирано

### Стартиране на тестове

```bash
npm test
```

---

## 8. package.json – scripts

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "test": "jest"
}
```

---

## 9. Често срещани проблеми

* Infinite loading → Socket.io route не работи
* Prisma грешки → липсва `db push`
* Празен екран → грешка в layout или provider

---

## Learn More

To learn more about Next.js, take a look at the following resources:

* [Next.js Documentation](https://nextjs.org/docs)
* [Learn Next.js](https://nextjs.org/learn)
* [Next.js GitHub repository](https://github.com/vercel/next.js)

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 10. Заключение

Проектът е пълноценен пример за modern full-stack приложение, покриващо:

* frontend
* backend
* база данни
* автоматизирано тестване


