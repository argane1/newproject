# 🔗 LinkVault — Personal Link Manager & Profile Builder

> A modern, auth-backed personal link manager built with Next.js 16, Clerk authentication, and Prisma ORM. Capture your profile, claim a unique username, and curate the links that matter to you—all in one sleek dashboard.

---

## ✨ Key Features

- **🔐 Secure Authentication** — Built-in Clerk integration for seamless sign-up/login with persistent sessions
- **🏷️ Username Claiming** — Lock in your unique display name (3–30 chars, lowercase alphanumeric + underscore)
- **🔗 Link Management** — Full CRUD operations: add, view, and delete personal links from the dashboard
- **📊 Personal Dashboard** — Clean profile page showing your username, email, and curated link list with real-time updates
- **⚡ Server Actions** — Type-safe server-side actions for all mutations (claim, fetch, create, delete)
- **🎨 Responsive UI** — Tailwind CSS v4 styling for a polished, mobile-friendly interface

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16.2.9 |
| Language | TypeScript | ^5 |
| UI Styling | Tailwind CSS | v4 (PostCSS) |
| ORM | Prisma | ^6.3 |
| Auth | Clerk | ^7.5.9 + SDK Node ^4.13.23 |
| Client Runtime | React | 19.2.4 |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x with npm
- A valid **[Clerk API Key](https://dashboard.clerk.com/)** (set as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`)

### Installation

```bash
# Clone the repository
git clone https://github.com/argane1/newproject.git
cd newproject

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env   # (edit with your Clerk keys)

# Run database migrations
npx prisma migrate dev --name init

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to begin.

---

## 📁 Project Structure

```
my-app/
├── app/                    # Next.js App Router routes & components
│   ├── actions.ts         # Server Actions (auth, CRUD operations)
│   ├── ClerkProvider.tsx  # Clerk authentication provider wrapper
│   ├── dashboard.tsx      # User profile dashboard page
│   ├── layout.tsx         # Root layout with global providers
│   └── page.tsx           # Home page (username claim + link list)
├── lib/
│   └── prisma.ts          # Prisma client singleton instance
├── prisma/
│   ├── schema.prisma      # Database schema (User, Link models)
│   └── migrations/        # Versioned migration files
├── public/                 # Static assets & favicons
├── .env.example            # Environment variables template
├── next.config.ts         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies & scripts
```

---

## 📝 License

This project is licensed under the MIT License.