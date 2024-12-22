
# User Management API

This project provides a user management API built using Express.js, Firebase Firestore, and Jest for testing.

## Features

- **Add User**: Add a new user to the Firestore database.
- **Update User**: Update existing user information.
- **Fetch User**: Retrieve a user's details by ID.
- **Authentication**: Middleware for token-based authentication.

## Project Structure

```
backend-repo/
├── config/
│   └── firebaseConfig.ts
├── controller/
│   └── api.ts
├── core/
│   └── app.ts
├── entities/
│   └── user.ts
├── middleware/
│   └── authMiddleware.ts
├── repository/
│   └── userCollection.ts
├── routes/
│   └── userRoutes.ts
└── package.json
```

### Key Files

- **firebaseConfig.ts**: Initializes Firebase Admin SDK and sets up Firestore.
- **api.ts**: Contains the controllers for user-related operations.
- **authMiddleware.ts**: Validates JWT tokens for API authentication.
- **userCollection.ts**: Interfaces with Firestore to manage user data.
- **userRoutes.ts**: Defines routes for user management.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd backend-repo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file with the following variables:

   ```env
   PORT=5000
   SECRET_KEY=<your-secret-key>
   FIREBASE_SERVICE_ACCOUNT=<path-to-your-service-account-file>
   ```

4. Start the server:

   ```bash
   npm run start
   ```

## API Endpoints

### 1. Add User

**POST** `/api/add-user`

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "1234567890"
  }
  ```

- **Responses**:
  - 201: `User added successfully`
  - 400: `Name and email are required`
  - 500: `Error adding user`

### 2. Update User

**PUT** `/api/update-user-data`

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

  ```json
  {
    "id": "user-id",
    "name": "John Doe",
    "email": "johnupdated@example.com"
  }
  ```

- **Responses**:
  - 200: `User updated successfully`
  - 400: `ID is required`
  - 500: `Error updating user`

### 3. Fetch User

**POST** `/api/fetch-user-data`

- **Headers**: `Authorization: Bearer <token>`
- **Body**:

  ```json
  {
    "id": "user-id"
  }
  ```

- **Responses**:
  - 200: `{ user object }`
  - 404: `User not found`
  - 500: `Error fetching user`

## Testing

Run the tests with the following command:

```bash
npm run test
```

### Test Coverage

- **Unit Tests**:
  - Repository functions (Firestore operations)
  - Controllers
  - Middleware
- **Integration Tests**:
  - API routes and middleware

## License

This project is licensed under the MIT License.
