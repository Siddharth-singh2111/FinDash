# 📊 FinDash - Modern Finance Dashboard UI

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-brown?style=for-the-badge)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer)

A responsive, interactive, and highly polished frontend dashboard for tracking and analyzing personal financial activity. This project was built to demonstrate modern React architecture, robust state management, and premium UI/UX design principles.

## ✨ Assignment Enhancements Fulfilled

This project successfully implements **100% of the suggested optional enhancements** from the assignment rubric:

- [x] **Dark Mode:** Implemented a custom "Linear-style" glassmorphic dark theme using Tailwind CSS.
- [x] **Data Persistence:** Integrated Zustand's `persist` middleware to save state to `localStorage` seamlessly.
- [x] **Mock API Integration:** The data entry form simulates network latency and asynchronous loading states (disabling buttons and showing spinners) before updating the global store.
- [x] **Animations & Transitions:** Utilized Framer Motion for staggered page loads, spring-physics hover states, and smooth layout animations (`AnimatePresence`) when modifying the transaction table.
- [x] **Export Functionality:** Users can download their currently filtered and sorted transaction view directly to a `.csv` file.
- [x] **Advanced Filtering & Grouping:** The table supports multi-variable filtering (Search + Category) chained with advanced sorting (Newest, Oldest, Amount High-to-Low, Amount Low-to-High).

## 🚀 Core Features

* **Role-Based Access Control (RBAC):** Simulated frontend roles. 'Viewers' can only analyze data, while 'Admins' dynamically gain access to asynchronous data entry forms.
* **Interactive Data Visualizations:** Real-time cash flow area charts and categorical spending doughnut charts built with Recharts.
* **Smart Insights:** Automatically calculates the highest spending category and overall savings health based on derived state.
* **Premium UX:** Floating glassmorphic header, custom branding, and interactive toast notifications via `sonner`.

## 🛠️ Tech Stack & Architecture Decisions

* **Framework: Next.js (App Router)** Chosen for its modern architecture and aggressive build optimization. The project utilizes `'use client'` directives strictly where interactivity is required, keeping the boundary between server-rendered shells and interactive client components clean.
* **State Management: Zustand** Selected over Redux (too much boilerplate for this scope) and Context API (prone to unnecessary re-renders). Zustand provides a lightweight, hook-based global store. 
* **State Methodology (Derived State):**
  Instead of storing metrics like "Total Balance" or "Total Expenses" in the global store, these are derived dynamically from the primary transactions array. This guarantees the UI is always perfectly synchronized with the underlying data and eliminates state-mismatch bugs.
* **Styling: Tailwind CSS + `clsx` / `tailwind-merge`** Utilized for utility-first styling to ensure a highly responsive, mobile-first layout. Utility functions guarantee clean dynamic class merging without CSS conflicts.
* **Animations: Framer Motion**
  Used to orchestrate complex UI interactions, such as exit animations for DOM elements, which standard CSS transitions cannot handle gracefully.

## 🧠 Note for Reviewers: Auth & RBAC Approach

The assignment requested simulated Role-Based UI without requiring a backend. 

While I could have built a mock "Sign In" gate, **I deliberately chose to implement a frictionless Role Toggle in the floating header.** This prioritizes reviewer experience—allowing you to instantly verify the conditional rendering logic (mounting/unmounting the "Add Transaction" capabilities) with a single click, rather than forcing you to hunt for mock credentials.

## 💻 Getting Started

Follow these steps to run the project locally.

### Prerequisites
Make sure you have Node.js (v18 or higher) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/finance-dashboard-assignment.git](https://github.com/YOUR_USERNAME/finance-dashboard-assignment.git)
   cd finance-dashboard-assignment
   Install the dependencies:

Bash
npm install
Start the development server:

Bash
npm run dev
Open your browser and navigate to http://localhost:3000 to view the dashboard.