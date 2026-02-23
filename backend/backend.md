# Backend - Studora Project Summary

The backend of Studora is a robust REST API built with Node.js and Express, designed to handle user authentication, product management, mentorship sessions, and messaging between students.

## 🛠️ Tech Stack & Libraries

| Library | Purpose |
| :--- | :--- |
| **Express.js** | Fast, unopinionated web framework for Node.js. |
| **Mongoose** | Elegant mongodb object modeling (ORM) for Node.js. |
| **JsonWebToken (JWT)** | Secure transmission of information between parties as a JSON object. |
| **Bcryptjs** | Optimized bcrypt in JavaScript for password hashing. |
| **CORS** | Middleware for enabling Cross-Origin Resource Sharing. |
| **Dotenv** | Loads environment variables from `.env` file. |

## 📂 Architecture & Project Structure

- **`models/`**: Mongoose schemas for MongoDB (User, Product, Mentor, Chat, Message, Order, etc.).
- **`routes/`**: API endpoint definitions (Users, Products, Mentors, Chats).
- **`controllers/`**: Logic for each endpoint (Login, Signup, Fetching products, Sending messages).
- **`middleware/`**: Custom logic like `protect` to verify JWT tokens before allowing access to private routes.
- **`config/db.js`**: MongoDB connection logic using Atlas.

## 🔄 Application Flow

### 1. Authentication Flow
- **Registration**: User sends details -> Password hashed with `bcrypt` -> User saved in MongoDB.
- **Login**: Password verified -> JWT generated with User ID -> JWT sent to frontend.
- **Protection**: Private routes use `protect` middleware to verify the JWT in the `Authorization` header.

### 2. Messaging Flow
- **Chat Creation**: Chats are created between a student and a mentor/seller.
- **Message Logic**: Messages are linked to a unique `chatId`.
- **Retrieval**: The `getMyChats` controller fetches all active conversations for the logged-in user.

### 3. Product & Mentorship Flow
- **Marketplace**: Sellers post products via `productRoutes`.
- **Mentorship**: Mentors register and students book sessions which initiate a chat.
