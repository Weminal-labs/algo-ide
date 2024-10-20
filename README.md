To run the backend, follow these steps:

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Navigate to the Algorand directory:
   ```
   cd algorand
   ```

4. Run Docker Compose to start the Algorand services:
   ```
   docker-compose up -d
   ```

5. Return to the backend root directory:
   ```
   cd ..
   ```

6. Start the development server:
   ```
   npm run dev
   ```

The backend server should now be running and connected to the Algorand services.

To run the frontend, follow these steps:

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run start
   ```