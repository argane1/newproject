# Next.js SaaS Platform with Clerk Authentication

A modern, production-ready full-stack application built with **Next.js** and **TypeScript**, featuring secure authentication via **Clerk**, type-safe database queries through **Prisma ORM**, and a responsive UI powered by **Tailwind CSS**.

---

## ✨ Key Features

- 🔐 **Secure Authentication**: Full Clerk integration for user management
- 💾 **Type-Safe Database**: Prisma ORM with PostgreSQL (SQLite dev)
- 🎨 **Responsive UI**: Tailwind CSS with shadcn/ui components
- 🚀 **Next.js App Router**: Modern server-side rendering and API routes
- 🔗 **Webhook Sync**: Automated Clerk sync via webhook handler
- 📊 **Dashboard**: User management interface

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 15.4 | React framework with App Router |
| TypeScript | Type-safe development |
| Prisma ORM | Database queries and schema management |
| Clerk | Authentication and user management |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Accessible, customizable components |
| PostgreSQL / SQLite | Database (dev: SQLite, prod: PostgreSQL) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/project.git
   cd project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (`.env`):
   ```env
   DATABASE_URL="file:./dev.db"  # For development
   CLERK_SECRET_KEY=your_clerk_secret_key_here
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 📁 Project Structure

```
project/
├── app/                     # Next.js App Router
│   ├── actions.ts           # Server actions
│   ├── ClerkProvider.tsx    # Clerk authentication wrapper
│   ├── dashboard.tsx        # Dashboard page
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Home page
├── lib/                     # Utilities
│   └── clerk-webhook-sync.ts  # Clerk webhook handler
├── prisma/                  # Database schema & migrations
│   ├── dev.db              # Development database
│   ├── fix-schema.sql      # Schema fixes
│   ├── schema.prisma       # Prisma schema definition
│   └── seed.js             # Database seeder
├── .gitignore               # Git ignore rules
└── package.json             # Dependencies & scripts
```

---

## 📝 License

This project is licensed under the MIT License.