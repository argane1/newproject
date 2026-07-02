Connect Clerk authentication to your Prisma database with a "Claim Username" flow.

**Goal:**

When a user signs in via Clerk, they don't automatically exist in YOUR database. Create a flow where:

1. Logged out → Show landing page with "Sign In" button
2. Logged in but no DB profile → Show "Claim Username" form
3. Has DB profile → Show dashboard

**User Model (already in schema):**

model User {
id Int @id @default(autoincrement())
email String @unique
username String @unique
clerkId String @unique
name String?
links Link[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

**Files to create/update:**

1. `app/actions.ts` - Server Action with `claimUsername(formData)`
2. `app/page.tsx` - Three-state UI (logged out / claim username / dashboard)
3. `app/api/users/route.ts` - Update POST to accept `clerkId`, `email`, `username`, `name`

**Requirements:**

- Use `'use server'` directive in `app/actions.ts`
- Use `currentUser()` from `@clerk/nextjs/server` to get auth user
- Store `clerkId`, `email`, `username`, and `name` in User model
- Use `redirect("/")` after successful profile creation
- Handle username uniqueness (Prisma will throw if duplicate)

**Pattern:**

1. Server Action receives FormData, validates username (min 3 chars, alphanumeric + underscore)
2. Creates User in Prisma with Clerk's `user.id` as `clerkId`
3. Page.tsx checks: `currentUser()` → then `prisma.user.findUnique({ where: { clerkId } })`
4. Render different UI based on auth state and DB state

**Keep it simple:**

- No middleware file needed
- No webhook sync (user creates profile manually)
- Basic validation (username length >= 3)
- Errors just throw (no fancy error UI for MVP)