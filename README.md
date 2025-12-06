# Barcia E-commerce

This is a simple e-commerce application built with React, Vite, and Firebase.

## Features

*   Browse products and view them by category.
*   View detailed information for each product.
*   Add products to a shopping cart.
*   A checkout form to complete purchases.
*   A page to review all past orders.

## Technologies Used

*   **Frontend:**
    *   [React](https://reactjs.org/)
    *   [Vite](https://vitejs.dev/)
    *   [React Router](https://reactrouter.com/)
    *   [Bootstrap](https://getbootstrap.com/) & [React-Bootstrap](https://react-bootstrap.github.io/) for styling.
    *   [SweetAlert2](https://sweetalert2.github.io/) for user-friendly notifications.
*   **Backend:**
    *   [Firebase](https://firebase.google.com/) (Firestore for the database).

## Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/barcia-ecom.git
    cd barcia-ecom
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Firebase:**

    The Firebase configuration is stored in `src/firebase/config.js`. For security, it is highly recommended to use environment variables instead of hardcoding your credentials.

    a. Create a `.env.local` file in the root of the project:
    ```bash
    touch .env.local
    ```

    b. Add your Firebase project configuration to the `.env.local` file. You can get these from your Firebase project settings.
    ```
    VITE_API_KEY=your-api-key
    VITE_AUTH_DOMAIN=your-auth-domain
    VITE_PROJECT_ID=your-project-id
    VITE_STORAGE_BUCKET=your-storage-bucket
    VITE_MESSAGING_SENDER_ID=your-messaging-sender-id
    VITE_APP_ID=your-app-id
    ```

    c. Update `src/firebase/config.js` to use these environment variables:
    ```javascript
    import { initializeApp } from "firebase/app";

    const firebaseConfig = {
        apiKey: import.meta.env.VITE_API_KEY,
        authDomain: import.meta.env.VITE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_APP_ID
    };

    export const app = initializeApp(firebaseConfig);
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Available Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run lint`: Lints the code using ESLint.
*   `npm run preview`: Serves the production build locally.
*   `npm run deploy`: Deploys the application to GitHub Pages.