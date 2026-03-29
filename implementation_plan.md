# Little Millennium — Kindergarten Management PWA

A modern, child-friendly Progressive Web App for managing kindergarten students and fees using Firebase.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript (Vite) |
| Styling | Tailwind CSS v4 (pastel kindergarten theme) |
| Backend | Firebase (Firestore + Auth) |
| PWA | vite-plugin-pwa |
| Charts | Recharts |
| PDF | jsPDF + jspdf-autotable |
| Notifications | react-hot-toast |
| Routing | react-router-dom v7 |
| Icons | lucide-react |

---

## Proposed Changes

### Phase 1: Project Scaffolding

#### [NEW] Project setup with Vite + React + TypeScript
- Initialize with `npx -y create-vite@latest ./ --template react-ts`
- Install dependencies:
  - `firebase`, `react-router-dom`, `react-hot-toast`, `recharts`, `jspdf`, `jspdf-autotable`, `lucide-react`
  - `tailwindcss @tailwindcss/vite` (Tailwind v4)
  - `vite-plugin-pwa` (PWA support)

#### Folder Structure
```
src/
├── components/
│   ├── Layout.tsx          # Sidebar + header layout
│   ├── ProtectedRoute.tsx  # Auth guard
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── DashboardCard.tsx   # Summary stat card
│   ├── StudentForm.tsx     # Add/Edit student form
│   ├── StudentTable.tsx    # Student list table
│   ├── FeesTable.tsx       # Fees overview table
│   ├── PaymentModal.tsx    # Update payment modal
│   ├── FeesChart.tsx       # Bar chart for fees analytics
│   ├── SearchBar.tsx       # Search + filter component
│   ├── ConfirmDialog.tsx   # Delete confirmation dialog
│   ├── Skeleton.tsx        # Loading skeleton
│   └── EmptyState.tsx      # Empty state illustration
├── pages/
│   ├── LoginPage.tsx       # Admin login
│   ├── DashboardPage.tsx   # Overview dashboard
│   ├── StudentsPage.tsx    # Student management
│   ├── FeesPage.tsx        # Fees management
│   └── NotFoundPage.tsx    # 404 page
├── services/
│   └── firebase.ts         # Firebase config + helpers
├── hooks/
│   ├── useAuth.ts          # Auth state hook
│   ├── useStudents.ts      # Firestore students hook
│   └── useStats.ts         # Dashboard stats hook
├── types/
│   └── index.ts            # TypeScript interfaces
├── context/
│   └── AuthContext.tsx      # Auth context provider
├── App.tsx
├── main.tsx
└── index.css               # Tailwind + custom styles
```

---

### Phase 2: Firebase Setup

#### [NEW] `src/services/firebase.ts`
- Firebase app initialization
- Firestore instance export
- Auth instance export
- Helper functions for CRUD operations on `students` collection

#### Firestore Structure
```
students (collection)
└── {studentId} (document)
    ├── name: string
    ├── age: number
    ├── class: string
    ├── parentName: string
    ├── contactNumber: string
    ├── address: string
    ├── admissionDate: string
    ├── createdAt: timestamp
    └── fees: {
        ├── totalFees: number
        ├── paidFees: number
        ├── pendingFees: number (auto-calculated)
        └── lastPaymentDate: string | null
    }
```

> [!IMPORTANT]
> You will need to provide your Firebase project configuration (apiKey, authDomain, projectId, etc.). I will set up placeholder values that you can replace.

---

### Phase 3: Authentication

#### [NEW] `src/context/AuthContext.tsx`
- Firebase Auth state listener
- Login/logout functions
- Auth context provider

#### [NEW] `src/pages/LoginPage.tsx`
- Beautiful kindergarten-themed login page
- Email + password form
- Error handling with toast notifications

#### [NEW] `src/components/ProtectedRoute.tsx`
- Wraps dashboard routes
- Redirects to login if unauthenticated

---

### Phase 4: Dashboard

#### [NEW] `src/pages/DashboardPage.tsx`
- Summary cards: Total Students, Total Fees Collected, Total Pending Fees
- Bar chart showing Paid vs Pending fees breakdown
- Animated entrance with smooth transitions
- Quick action buttons

---

### Phase 5: Student Management

#### [NEW] `src/pages/StudentsPage.tsx`
- Student list in responsive table/card view
- Search by name, class, parent name
- Filter by class
- Add/Edit/Delete operations

#### [NEW] `src/components/StudentForm.tsx`
- Reusable form for create and edit
- Form validation
- Includes fee fields (totalFees, paidFees)

---

### Phase 6: Fees Management

#### [NEW] `src/pages/FeesPage.tsx`
- Fees table with all students
- Color-coded pending amounts
- "Update Payment" button per student

#### [NEW] `src/components/PaymentModal.tsx`
- Modal to enter payment amount
- Auto-calculates new pending fees
- Updates Firestore

---

### Phase 7: PWA Configuration

#### [NEW] PWA manifest + service worker via vite-plugin-pwa
- App name: "Little Millennium"
- Theme color: pastel purple
- Icons generated
- Offline caching strategy (NetworkFirst for API, CacheFirst for assets)
- Installable on mobile and desktop

---

### Phase 8: Bonus Features

- **PDF Export**: Export fees data as PDF with jsPDF
- **Analytics Chart**: Recharts bar chart for paid vs pending
- **Toast Notifications**: react-hot-toast for all CRUD operations
- **Skeleton Loading**: Custom skeleton components during data fetch
- **Smooth Animations**: CSS transitions and keyframe animations

---

## Design Theme

- **Primary**: Soft purple (`#8B5CF6` → `#A78BFA`)
- **Secondary**: Warm pink (`#EC4899` → `#F472B6`)
- **Accent**: Sky blue (`#38BDF8`), Mint green (`#34D399`)
- **Background**: Warm cream (`#FFF7ED`) / soft lavender (`#F5F3FF`)
- **Cards**: White with subtle shadows and rounded corners (xl/2xl)
- **Typography**: "Nunito" font (child-friendly, rounded)
- **Buttons**: Gradient backgrounds with hover animations
- **Overall Feel**: Playful, warm, professional

---

## User Review Required

> [!IMPORTANT]
> **Firebase Configuration**: Please provide your Firebase project credentials, or I will use placeholder values that you'll need to replace in `src/services/firebase.ts`. You'll need:
> - `apiKey`
> - `authDomain`
> - `projectId`
> - `storageBucket`
> - `messagingSenderId`
> - `appId`

> [!IMPORTANT]
> **Admin Account**: After deployment, you'll need to manually create an admin user in Firebase Console → Authentication → Users → Add user. The app will allow any authenticated user to access the dashboard.

> [!NOTE]
> **Tailwind CSS Version**: The request mentions Tailwind CSS. I will use **Tailwind CSS v4** (latest) with the Vite plugin. Please confirm if you prefer v3 instead.

---

## Open Questions

1. **Firebase credentials**: Do you have an existing Firebase project, or should I use placeholder values?
2. **Tailwind version**: Tailwind v4 (latest) or v3?
3. **Any specific branding**: Do you have a logo or specific color preferences for "Little Millennium"?

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify TypeScript compilation
- Run `npm run dev` and test in browser

### Manual Verification
- Test login flow with Firebase Auth
- Test CRUD operations on students
- Test fee payment updates
- Verify PWA installability
- Test offline support
- Test responsive design on mobile viewport
- Verify PDF export
- Check chart rendering
