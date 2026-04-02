# 📊 Finance Dashboard UI

A responsive, interactive frontend dashboard for tracking and analyzing personal financial activity. Built as a demonstration of modern React architecture, state management, and data visualization.

## ✨ Features

* **Role-Based Access Control (RBAC):** Simulated frontend roles. 'Viewers' can only read data, while 'Admins' have access to data entry forms to add new transactions.
* **Interactive Data Visualizations:** Real-time cash flow area charts and categorical spending doughnut charts.
* **Smart Insights:** Automatically calculates the highest spending category and overall savings health based on the current data set.
* **Advanced Table Controls:** Search transactions by description and filter by dynamic categories.
* **Data Persistence:** Utilizes browser `localStorage` to ensure added transactions and application state survive page refreshes.
* **Responsive Design:** Fully mobile-optimized layout that gracefully transitions from stacked cards to full data tables on desktop screens.

## 🛠️ Tech Stack & Architecture Decisions

* **Framework:** [Next.js (App Router)](https://nextjs.org/) - Chosen for its modern architecture, fast local development, and seamless transition between Server and Client components.
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) - Utilized for rapid, utility-first styling, ensuring a consistent design system and highly responsive layouts without bloated CSS files.
* **State Management:** [Zustand](https://github.com/pmndrs/zustand) - Selected over Redux or Context API for its lightweight footprint and lack of boilerplate. It handles the global transaction data and role state without causing unnecessary re-renders across the component tree.
* **Data Visualization:** [Recharts](https://recharts.org/) - Used for its declarative React syntax and easy customization, allowing for dynamic rendering as the global state updates.
* **Icons:** [Lucide React](https://lucide.dev/) - For clean, consistent, and accessible SVG icons.

## 🚀 Getting Started

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
Start the development server: ```

Bash
npm run dev
Open your browser and navigate to http://localhost:3000 to view the dashboard.

🧠 Approach & Methodology
State Separation: I intentionally separated global state (transactions, active user role) from local UI state (search queries, form inputs, category filters). This ensures that typing in the search bar only re-renders the transaction list, rather than the entire dashboard, optimizing performance.

Derived State: Instead of storing "Total Balance" or "Total Expenses" in the global store, these metrics are derived dynamically from the primary transactions array. This guarantees that the UI is always perfectly in sync with the underlying data and prevents state-mismatch bugs.