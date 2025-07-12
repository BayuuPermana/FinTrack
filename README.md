# FinTrack - Personal Finance Tracker

FinTrack is a modern, responsive personal finance management application designed to help you take control of your financial life. Track your income and expenses, manage bills, set and monitor savings goals, and visualize your financial habits with insightful reports.

![FinTrack Screenshot](https://i.imgur.com/YOUR_SCREENSHOT_URL.png) 
*(Note: You can replace this with a screenshot of the app)*

## ✨ Key Features

*   **Dashboard:** Get a comprehensive overview of your finances at a glance, including income, expenses, current balance, and upcoming bills.
*   **Transaction Management:** Easily add, edit, and delete income or expense records with descriptions, categories, and dates.
*   **Bill Tracking:** Never miss a payment again. Add recurring or one-time bills, get reminders for upcoming due dates, and mark them as paid.
*   **Financial Goals:** Set savings goals (e.g., for a vacation, a new car) and track your progress as you contribute funds.
*   **Insightful Reports:** Visualize your monthly cash flow with interactive charts to understand your spending patterns.
*   **Responsive Design:** Access and manage your finances seamlessly on both desktop and mobile devices.
*   **Dark Mode:** A sleek, eye-friendly dark theme is available (implementation in progress).

## 🚀 Tech Stack

*   **Frontend:**
    *   [React](https://reactjs.org/) (v18)
    *   [Tailwind CSS](https://tailwindcss.com/) for styling
    *   [Recharts](https://recharts.org/) for charts and data visualization
    *   [Lucide React](https://lucide.dev/) for icons
*   **Backend (BaaS):**
    *   [Firebase](https://firebase.google.com/)
        *   **Firestore:** Real-time NoSQL database for data storage.
        *   **Firebase Authentication:** For user management (currently configured for anonymous sign-in).
*   **Development:**
    *   [Create React App](https://create-react-app.dev/)

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v16 or later)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   A Google account to create a Firebase project.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/fintrack.git
    cd fintrack
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```
    or
    ```sh
    yarn install
    ```

3.  **Set up Firebase:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    *   In your project dashboard, add a new Web App.
    *   You will be given a `firebaseConfig` object. Copy these credentials.
    *   Open the `src/firebase/config.js` file in the project.
    *   **Crucially, replace the existing placeholder configuration with your own Firebase project credentials.**

    ```javascript
    // src/firebase/config.js

    // Replace this with your own Firebase configuration
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```
    > **Security Note:** It is strongly recommended to use environment variables to store your Firebase keys rather than hardcoding them directly in the source file, especially for a production application.

4.  **Run the development server:**
    ```sh
    npm start
    ```
    The application should now be running on [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

The project follows a standard Create React App structure, with application-specific code located in the `src` directory.

```
/src
├── /components/      # Reusable UI and form components
│   ├── /forms
│   └── /ui
├── /contexts/        # React Context for global state (Auth, Data, Theme)
├── /firebase/        # Firebase configuration and initialization
├── /pages/           # Top-level page components (Dashboard, Transactions, etc.)
├── /utils/           # Utility functions (e.g., currency formatting)
├── App.js            # Main application component with routing logic
├── index.css         # Global styles and Tailwind CSS imports
└── index.js          # Application entry point
```

## 🚀 Deployment

To create a production-ready build of the app, run:

```sh
npm run build
```

This will create a `build` folder with optimized, static assets that can be deployed to any static site hosting service like Vercel, Netlify, or Firebase Hosting.
