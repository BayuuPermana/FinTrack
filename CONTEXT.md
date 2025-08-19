# FinTrack Application Context

This document provides a high-level overview of the FinTrack application's structure and key components to streamline future development and modifications.

## Project Structure

The application is a standard Create React App project with the following directory structure:

```
/
├── .gitignore
├── package.json
├── README.md
├── tailwind.config.js
├── public/
│   └── index.html
└── src/
    ├── App.js
    ├── index.css
    ├── index.js
    ├── components/
    │   ├── forms/
    │   └── ui/
    ├── contexts/
    ├── firebase/
    ├── pages/
    └── utils/
```

## Key Components and Their Responsibilities

### `src/App.js`

-   **Purpose:** The main application component.
-   **Responsibilities:**
    -   Sets up the main layout, including the sidebar and main content area.
    -   Handles page navigation and routing using a state-based approach.
    -   Manages the sidebar's open/closed and collapsed/expanded states.

### `src/pages/`

-   **Purpose:** Contains the main pages of the application.
-   **Key Files:**
    -   `Dashboard.js`: The main dashboard page.
    -   `TransactionsPage.js`: Displays a list of transactions.
    -   `BillsPage.js`: Manages recurring bills.
    -   `GoalsPage.js`: Tracks financial goals.
    -   `ReportsPage.js`: Displays financial reports and charts.
    -   `SettingsPage.js`: Contains application settings.

### `src/components/`

-   **Purpose:** Contains reusable UI components.
-   **Subdirectories:**
    -   `forms/`: Contains forms for adding and editing data (e.g., `TransactionForm.js`, `GoalForm.js`).
    -   `ui/`: Contains general UI elements like `Button.js`, `Card.js`, and `Modal.js`.

### `src/contexts/`

-   **Purpose:** Contains React contexts for managing global state.
-   **Key Files:**
    -   `AuthContext.js`: Manages user authentication state.
    -   `DataContext.js`: Manages financial data (transactions, bills, goals).
    -   `ThemeContext.js`: Manages the application's theme (light/dark).

### `src/firebase/`

-   **Purpose:** Contains Firebase configuration and initialization code.
-   **Key Files:**
    -   `config.js`: Initializes the Firebase app and exports Firebase services.

### `src/utils/`

-   **Purpose:** Contains utility functions used throughout the application.
-   **Key Files:**
    -   `formatCurrency.js`: A function for formatting currency values.

### Styling

-   **`tailwind.config.js`:** The configuration file for Tailwind CSS. The theme is not heavily customized here, relying on Tailwind's default color palette and utility classes.
-   **`src/index.css`:** The main CSS file where Tailwind CSS is imported.
-   **Theme Colors:** The application uses a light and dark theme. The primary accent color is `sky-500`, and the light theme uses soft, light colors.

By referencing this document, we can quickly understand the application's architecture and locate the relevant files for future tasks, reducing the need for extensive file searches and keeping our interactions efficient.

---

## Changelog

### Budget Form Category Dropdown (August 19, 2025)

-   **Component:** `src/components/forms/BudgetForm.js`
-   **Change:** Modified the "Category" field from a text input to a dropdown menu (`<select>`).
-   **Reasoning:** To ensure data consistency, the dropdown is now dynamically populated with unique expense categories sourced directly from the user's existing transactions via the `DataContext`. This prevents typos and restricts budget categories to those that are actively in use, improving data integrity.
-   **Related Changes:** Removed the `expenseCategories` prop from `src/pages/BudgetsPage.js` as the form now sources its own data.
