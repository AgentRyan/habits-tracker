# Session 1 — Habit Tracker Webapp

## What we built

A dark-themed, fully responsive habit tracking webapp built from scratch.

**Live URL:** https://habits-tracker-delta-lemon.vercel.app  
**GitHub:** https://github.com/AgentRyan/habits-tracker

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | NextAuth v4 (Google Sign-In) |
| Database | Firebase Firestore |
| Charts | Recharts |
| Deployment | Vercel (auto-deploys from GitHub) |

---

## App Structure

4 screens with a fixed bottom nav bar:

### 1. Home (`/home`)
- Greeting header with user's first name + profile photo
- Ring chart showing today's habit completion % 
- Quick-complete list for today's habits
  - Boolean habits: tap to check off
  - Numeric habits: +/- stepper (e.g. 48/64 oz water)

### 2. Habits (`/habits`)
- Weekly grid view (Mon–Sun) for all habits
- Week summary banner ("X/7 perfect days")
- Per-habit rows showing completion dots/arcs per day
- "+" button opens AddHabitSheet:
  - Name input
  - Icon picker (30 emoji icons)
  - Type: Boolean (done/not done) OR Numeric (track amount)
  - If Numeric: unit (oz, g, min, reps, pages...) + daily goal

### 3. Goals (`/goals`)
- 4 categories: Personal Growth, Work & Business, Health & Fitness, Personal
- Accordion cards per category, expandable
- Each goal has a progress bar + slider to update %
- "+" button to add goals with category + starting progress

### 4. Progress (`/progress`)
- Goals completed count + progress bar
- Current streak / Longest streak / 30-day success rate
- Line chart (Recharts) with 1W / 2W / 3W / 4W toggle

---

## Firestore Schema

All data lives under `users/{uid}/`:

```
users/{uid}
  habits/{habitId}
    - name, icon, type ("boolean"|"numeric"), unit, dailyGoal, order, isActive

  habitLogs/{YYYY-MM-DD_habitId}
    - habitId, date, completed (bool), value (number|null), completedAt

  goals/{goalId}
    - title, category, categoryColor, progress (0-100), isCompleted, order
```

---

## Key Files

```
app/
  page.tsx              ← auth check → redirect /home or /login
  login/page.tsx        ← Google Sign-In screen
  home/page.tsx
  habits/page.tsx
  goals/page.tsx
  progress/page.tsx
  api/auth/[...nextauth]/route.ts

components/
  layout/BottomNav.tsx
  layout/AppShell.tsx   ← auth guard + bottom nav wrapper
  home/TodayProgress.tsx
  home/TodayHabitList.tsx
  habits/HabitRow.tsx
  habits/WeekSelector.tsx
  habits/WeekSummaryBanner.tsx
  habits/AddHabitSheet.tsx
  goals/GoalCategory.tsx
  goals/AddGoalSheet.tsx
  progress/ (cards + chart inline in page)

lib/
  firebase.ts           ← Firebase init (browser-only guard)
  auth.ts               ← NextAuth config + Google provider
  hooks/useAuth.ts
  hooks/useHabits.ts    ← real-time Firestore listeners + log writes
  hooks/useGoals.ts
  utils/dateUtils.ts
  utils/streakUtils.ts  ← streak + success rate calculation
```

---

## Environment Variables

Set in `.env.local` (local) and Vercel dashboard (production):

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXTAUTH_SECRET
NEXTAUTH_URL                   ← https://habits-tracker-delta-lemon.vercel.app
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

Firebase project name: `ice-habits`

---

## Known Issues / Things Left To Do

- Firestore security rules need to be deployed (currently using default rules — tighten before sharing with others)
- No profile/settings page yet (sign out, edit display name, etc.)
- No habit reordering (drag to reorder would be a nice addition)
- No notifications / reminders
- The `export const dynamic = "force-dynamic"` is set on all pages but Next.js 16 still statically renders them — Firebase is guarded with a `typeof window !== "undefined"` check to handle this

---

## How to Run Locally

```bash
cd /Users/ryanmoran/Desktop/Habits
npm run dev
# → http://localhost:3000
```

Make sure `.env.local` has all variables filled in.

## How to Deploy

```bash
npx vercel --prod
```

Or just push to GitHub — Vercel is connected and auto-deploys on every push to `main`.
