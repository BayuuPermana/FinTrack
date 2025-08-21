
# GEMINI.md - FinTrack Project Context

## Project Overview

This directory contains the source code for **FinTrack**, a personal finance tracking application built with React. The application allows users to manage their finances by tracking income and expenses, managing bills, setting savings goals, and viewing financial reports.

The project uses a modern frontend stack:

*   **Framework:** React.js (v18)
*   **Styling:** Tailwind CSS with a dark mode theme.
*   **Charts:** Chart.js for data visualization.
*   **Icons:** Lucide React for UI icons.
*   **Backend as a Service (BaaS):** Firebase is used for the database (Firestore) and user authentication.

The application is structured as a single-page application (SPA) with a sidebar for navigation and a main content area to display different pages. The state is managed through a combination of React's component state and Context API for global data like authentication, application data, and theme.

## Building and Running

The project uses `react-scripts` (from Create React App) for its build scripts. The following commands are available in `package.json`:

*   **`npm start`**: Starts the development server at `http://localhost:3000`.
*   **`npm run build`**: Builds the application for production.
*   **`npm test`**: Runs the test suite.
*   **`npm run eject`**: Ejects from Create React App's configuration.

### Development Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Configure Firebase:**
    *   The Firebase configuration is located in `src/firebase/config.js`.
    *   To run the application, you will need to replace the placeholder Firebase configuration with your own project's credentials.
3.  **Run the Application:**
    ```bash
    npm start
    ```

## Development Conventions

*   **Component-Based Architecture:** The application is organized into reusable components located in `src/components`. This includes UI elements and forms.
*   **Styling:** Tailwind CSS is used for styling, and the configuration is in `tailwind.config.js`. The application supports a dark mode theme, which is managed through the `ThemeContext`.
*   **State Management:**
    *   React's `useState` hook is used for component-level state.
    *   React's Context API is used for global state management. The contexts are defined in `src/contexts`:
        *   `AuthContext`: Manages user authentication state.
        *   `DataContext`: Manages the application's data from Firestore.
        *   `ThemeContext`: Manages the application's theme (light/dark mode).
*   **Routing:** The application uses a custom routing solution implemented in `src/App.js` that uses component state to render different pages.
*   **Firebase Integration:** The Firebase configuration and initialization are handled in `src/firebase/config.js`. The application uses Firestore as its database and Firebase Authentication for user management.
