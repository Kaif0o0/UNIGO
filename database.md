# 🗄️ Database Documentation

## Overview

This project uses **MongoDB** as its database, accessed via **Mongoose** (an ODM — Object Data Modeling library for Node.js). The connection is managed in `backend/config/db.js` and established at server startup in `backend/server.js`.

---

## 🔌 How the Database Connects

**File:** `backend/config/db.js`

```js
const conn = await mongoose.connect(process.env.MONGO_URI);
```

- The connection string is stored as `MONGO_URI` in the `.env` file (e.g. a MongoDB Atlas cluster URL).
- `connectDB()` is called immediately when `server.js` starts.
- If the connection fails, the process exits with code `1` (hard crash — intentional, so the app doesn't run without a DB).

**Flow:**
```
server.js starts → calls connectDB() → mongoose.connect(MONGO_URI) → MongoDB Atlas connected
```

---

## 📦 Collections (Models)

MongoDB stores data in **collections**. Each Mongoose model maps to one collection. This project has **9 collections** (models):

| Collection | File | Purpose |
|---|---|---|
| `users` | `User.js` | All registered users (students & admins) |
| `mentors` | `Mentor.js` | Users who registered as mentors |
| `products` | `Product.js` | Study materials (Notes, Books, etc.) listed for sale |
| `services` | `Service.js` | Freelance services offered by students |
| `orders` | `Order.js` | Purchase records for services |
| `deliveries` | `Delivery.js` | Submitted delivery files for completed orders |
| `reviews` | `Review.js` | Ratings/comments left after an order |
| `chats` | `Chat.js` | Conversation sessions between a student and a mentor |
| `messages` | `Message.js` | Individual messages inside a chat |

---

## 📋 Detailed Schema Breakdown

### 1. `User` — `users` collection

Stores every person who registers on the platform.

| Field | Type | Details |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, unique |
| `password` | String | Required, **hashed with bcrypt before saving** |
| `role` | String | `'student'` (default) or `'admin'` |
| `college` | String | Optional |
| `department` | String | Optional |
| `year` | String | Optional |
| `skills` | [String] | Array of skill tags |
| `rating` | Number | Default `0` |
| `totalEarnings` | Number | Default `0` |
| `createdAt` | Date | Auto set |

> **Security:** A `pre('save')` hook runs `bcrypt.hash()` on the password before it ever touches the database. A `comparePassword()` method is used for login.

---

### 2. `Mentor` — `mentors` collection

When a student registers as a mentor, a separate Mentor document is created (linked to their `User`).

| Field | Type | Details |
|---|---|---|
| `user` | ObjectId → `User` | Reference to the user who is the mentor |
| `name` | String | Required |
| `skills` | [String] | Required |
| `price` | Number | Hourly/session price, default `0` |
| `bio` | String | Required |
| `experience` | String | Default `'Experienced Student'` |
| `isActive` | Boolean | Whether the mentor is available, default `true` |
| `createdAt`, `updatedAt` | Date | Auto-managed by `timestamps: true` |

> **Why separate from User?** A `User` is always needed for auth. A `Mentor` profile is only needed if they opt in. This keeps the data clean and allows a user to be both a student and a mentor.

---

### 3. `Product` — `products` collection

Study materials (Notes, Books, Test Series, Question Banks) that students can sell.

| Field | Type | Details |
|---|---|---|
| `seller` | ObjectId → `User` | Who listed the product |
| `title` | String | Required |
| `description` | String | Required |
| `category` | String | One of: `Notes`, `Books`, `Test-Series`, `Question Bank` |
| `price` | Number | Required |
| `pdfUrl` | String | Optional — link to the actual PDF |
| `thumbnailUrl` | String | Required — cover image |
| `isActive` | Boolean | Soft-delete flag, default `true` |
| `createdAt` | Date | Auto set |

---

### 4. `Service` — `services` collection

Freelance services listed by students (e.g. tutoring, assignment help).

| Field | Type | Details |
|---|---|---|
| `sellerId` | ObjectId → `User` | Who offers the service |
| `title` | String | Required |
| `description` | String | Required |
| `category` | String | Required |
| `price` | Number | Required |
| `deliveryTime` | String | e.g. `"2 days"` |
| `tags` | [String] | Search/filter tags |
| `rating` | Number | Auto-calculated, default `0` |
| `isActive` | Boolean | Default `true` |
| `createdAt` | Date | Auto set |

---

### 5. `Order` — `orders` collection

Created when a buyer purchases a service.

| Field | Type | Details |
|---|---|---|
| `serviceId` | ObjectId → `Service` | Which service was ordered |
| `buyerId` | ObjectId → `User` | Who purchased |
| `sellerId` | ObjectId → `User` | Who must deliver |
| `amount` | Number | Price at time of purchase |
| `status` | String | `Pending` → `Active` → `Delivered` → `Completed` / `Cancelled` |
| `paymentStatus` | String | `Unpaid` or `Paid` |
| `deliveryStatus` | String | `NotStarted` → `In Progress` → `Submitted` |
| `createdAt` | Date | Auto set |

---

### 6. `Delivery` — `deliveries` collection

When a seller submits work for an order, a Delivery document is created.

| Field | Type | Details |
|---|---|---|
| `orderId` | ObjectId → `Order` | Which order this belongs to |
| `fileUrl` | String | Required — link to the submitted file |
| `submittedAt` | Date | Auto set |

---

### 7. `Review` — `reviews` collection

Left by the buyer after an order is completed.

| Field | Type | Details |
|---|---|---|
| `orderId` | ObjectId → `Order` | The completed order |
| `reviewerId` | ObjectId → `User` | Who wrote the review |
| `targetUserId` | ObjectId → `User` | Who is being reviewed (the seller) |
| `rating` | Number | 1–5 stars |
| `comment` | String | Optional text |
| `createdAt` | Date | Auto set |

---

### 8. `Chat` — `chats` collection

Represents one ongoing conversation between a student and a mentor.

| Field | Type | Details |
|---|---|---|
| `participants` | [ObjectId → `User`] | Array of 2 user IDs in the conversation |
| `mentor` | ObjectId → `Mentor` | The mentor involved |
| `lastMessage` | ObjectId → `Message` | Reference to the most recent message (for inbox preview) |
| `createdAt`, `updatedAt` | Date | Auto-managed by `timestamps: true` |

---

### 9. `Message` — `messages` collection

Each individual message inside a chat.

| Field | Type | Details |
|---|---|---|
| `chat` | ObjectId → `Chat` | Which chat this belongs to |
| `sender` | ObjectId → `User` | Who sent the message |
| `text` | String | Required — the message content |
| `createdAt`, `updatedAt` | Date | Auto-managed by `timestamps: true` |

---

## 🔗 How Collections Relate to Each Other

```
User ──────────────────┐
  │                    │
  ├──[as seller]──► Product
  │
  ├──[as seller]──► Service ──► Order ──► Delivery
  │                               │
  │                               └──► Review (reviewerId / targetUserId)
  │
  ├──[registers as]──► Mentor
  │
  └──[participant in]──► Chat ──► Message
                           │
                           └──► Mentor
```

- **One User → Many Products** (seller)
- **One User → Many Services** (as seller), **Many Orders** (as buyer or seller)
- **One User → One Mentor** profile (optional)
- **One Chat → Many Messages**; a Chat always has exactly 2 participants + 1 mentor
- **One Order → One Delivery** + **One Review**

---

## 🔍 How Data is Extracted (Read Operations)

All data extraction happens through Mongoose in the **controllers**. Below are the key patterns:

### Pattern 1: Find All (with population)

```js
// Get all active products with seller's name & email attached
const products = await Product.find({ isActive: true })
  .populate('seller', 'name email');
```
- `.find({})` = SQL `SELECT * WHERE`
- `.populate('field', 'cols')` = SQL `JOIN` — replaces the stored `ObjectId` with the actual document data

---

### Pattern 2: Find One (Login / Profile)

```js
// Find user by email for login
const user = await User.findOne({ email });

// Find user by their JWT-decoded ID for profile
const user = await User.findById(req.user._id);
```

---

### Pattern 3: Create (Insert)

```js
// Create a new product
const product = new Product({ seller: req.user._id, title, ... });
await product.save(); // Inserts into DB
```

Or shorthand:
```js
const user = await User.create({ name, email, password, role });
```

---

### Pattern 4: Complex Chat Query

```js
// Find a chat where BOTH users are participants AND the mentor matches
let chat = await Chat.findOne({
  mentor: mentorId,
  participants: { $all: [req.user._id, participantId] }
}).populate('participants', 'name email')
  .populate('mentor', 'name');
```
- `$all` = MongoDB array operator — both IDs must be present in the array

---

### Pattern 5: Get Messages (Sorted)

```js
const messages = await Message.find({ chat: req.params.id })
  .sort({ createdAt: 1 })   // oldest first
  .populate('sender', 'name');
```

---

### Pattern 6: Get User's Inbox (Nested Population)

```js
const chats = await Chat.find({ participants: req.user._id })
  .populate('participants', 'name email')
  .populate('mentor', 'name')
  .populate({ path: 'lastMessage', select: 'text createdAt sender' })
  .sort({ updatedAt: -1 }); // most recent first
```

---

### Pattern 7: Update

```js
// Update the lastMessage pointer in the chat document
await Chat.findByIdAndUpdate(req.params.id, { lastMessage: message._id });
```

---

### Pattern 8: Delete (Cascading)

```js
// Delete all messages in a chat, then delete the chat itself
await Message.deleteMany({ chat: req.params.id });
await Chat.findByIdAndDelete(req.params.id);
```

---

## 🔐 Authentication & Data Security

| Mechanism | How it works |
|---|---|
| **Password hashing** | `bcrypt` hashes the password in a Mongoose `pre('save')` hook — the plain password is **never stored** |
| **JWT Tokens** | On login/signup, a JWT is generated via `generateToken(user._id)` and returned to the frontend |
| **Protected Routes** | The `protect` middleware (in `authMiddleware.js`) verifies the JWT on every private API request and attaches `req.user` |
| **Authorization check** | e.g. only a chat participant can delete the chat — checked with `chat.participants.some(p => p.toString() === req.user._id.toString())` |

---

## 🌐 API Routes & Database Actions Summary

### Users (`/api/users`)

| Method | Route | DB Action | Auth |
|---|---|---|---|
| POST | `/signup` | `User.create()` | Public |
| POST | `/login` | `User.findOne({ email })` | Public |
| GET | `/profile` | `User.findById(req.user._id)` | Private |

### Products (`/api/products`)

| Method | Route | DB Action | Auth |
|---|---|---|---|
| POST | `/` | `new Product().save()` | Private |
| GET | `/` | `Product.find({ isActive: true }).populate(...)` | Public |
| GET | `/:id` | `Product.findById(id).populate(...)` | Public |

### Mentors (`/api/mentors`)

| Method | Route | DB Action | Auth |
|---|---|---|---|
| POST | `/` | `new Mentor().save()` | Private |
| GET | `/` | `Mentor.find({ isActive: true }).populate(...)` | Public |

### Chats (`/api/chats`)

| Method | Route | DB Action | Auth |
|---|---|---|---|
| GET | `/` | `Chat.find({ participants: userId }).populate(...)` | Private |
| POST | `/` | `Chat.findOne(...)` or `new Chat().save()` | Private |
| DELETE | `/:id` | `Message.deleteMany(...)` + `Chat.findByIdAndDelete(...)` | Private |
| GET | `/:id/messages` | `Message.find({ chat: id }).sort(...)` | Private |
| POST | `/:id/messages` | `new Message().save()` + `Chat.findByIdAndUpdate(...)` | Private |

---

## 📁 Key Files Reference

| File | Role |
|---|---|
| `backend/config/db.js` | MongoDB connection setup |
| `backend/server.js` | App entry point, mounts all routes |
| `backend/models/*.js` | Mongoose schemas (one per collection) |
| `backend/controllers/*.js` | Business logic + all DB queries |
| `backend/routes/*.js` | Express route definitions |
| `backend/middleware/authMiddleware.js` | JWT verification (protects private routes) |
| `backend/utils/generateToken.js` | Creates JWTs for auth |
| `backend/.env` | Stores `MONGO_URI`, `JWT_SECRET`, etc. (never committed to Git) |
