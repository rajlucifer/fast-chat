# 💬 NeuroChat

<div align="center">

A full-stack **real-time chat application** built with React, Node.js, Socket.IO & MongoDB.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Deployed on Render](https://img.shields.io/badge/Deployed-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

</div>

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure signup & login with bcrypt-hashed passwords
- ⚡ **Real-Time Messaging** — Instant message delivery powered by Socket.IO
- 🟢 **Online Presence** — Live green indicators for online users
- 🖼️ **Image Sharing** — Send images in chat, uploaded to Cloudinary
- 🗑️ **Message Deletion** — Delete any message in real-time for both sender & receiver
- 🔔 **Unseen Message Badges** — Unread count per conversation shown in the sidebar
- 👤 **Profile Management** — Update display name, bio, and avatar
- 📱 **Fully Responsive** — Mobile, tablet & desktop ready
- 🔒 **Protected Routes** — Auth-guarded pages on both client and server

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| React Router DOM | 7 | Client-side routing |
| Socket.IO Client | 4.8 | Real-time communication |
| Axios | 1.19 | HTTP requests |
| React Hot Toast | 2.6 | Toast notifications |
| React Icons | 5.7 | Icon library |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 24 | Runtime |
| Express | 5.2 | Web framework |
| Socket.IO | 4.8 | WebSocket server |
| MongoDB + Mongoose | 9.9 | Database & ODM |
| JSON Web Token | 9 | Authentication tokens |
| bcryptjs | 3 | Password hashing |
| Cloudinary SDK | 2.10 | Media/image storage |
| dotenv | 17 | Environment config |

---

## 📁 Project Structure

```
chatapp/
├── backend/
│   ├── server.js                    # Entry point — Express + Socket.IO server
│   ├── package.json
│   └── src/
│       ├── controllers/
│       │   ├── messageController.js # Message CRUD + real-time emit
│       │   └── userController.js    # Signup, login, profile update
│       ├── middleware/
│       │   └── auth.js              # JWT protect route + checkAuth
│       ├── models/
│       │   ├── Message.js           # Message schema
│       │   └── Users.js             # User schema
│       ├── routes/
│       │   ├── messageRoutes.js     # /api/messages/* routes
│       │   └── userRoutes.js        # /api/auth/* routes
│       └── lib/
│           ├── cloudinary.js        # Cloudinary configuration
│           ├── db.js                # MongoDB connection
│           └── utils.js             # JWT token generator
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx                  # Routes: /, /login, /profile
        ├── main.jsx                 # React root with context providers
        ├── pages/
        │   ├── HomePage.jsx         # Main chat layout
        │   ├── LoginPage.jsx        # Sign up / Login form
        │   └── ProfilePage.jsx      # Edit profile page
        ├── components/
        │   ├── SideBar.jsx          # User list + unseen badges
        │   ├── ChatContainer.jsx    # Chat window + message input
        │   └── RightSideBar.jsx     # Selected user info panel
        ├── context/
        │   ├── AuthContext.jsx      # Auth state + socket connection
        │   └── ChatContext.jsx      # Messages, users, real-time events
        └── lib/
            └── utils.js             # Date formatter utility
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB Atlas** account (or a local MongoDB instance)
- **Cloudinary** account (for image uploads)

### 1. Clone the repository

```bash
git clone https://github.com/rajlucifer/NeuroChat.git
cd NeuroChat
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` (see [Environment Variables](#-environment-variables) below), then:

```bash
npm run dev     # Development — hot reload with nodemon
npm start       # Production
```

> The backend runs on **`http://localhost:3000`** by default.

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

```bash
npm run dev     # Starts Vite dev server
```

> The frontend runs on **`http://localhost:5173`** by default.

---

## 🔑 Environment Variables

### Backend — `backend/.env`

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/chat-app
JWT_SECRET=your_super_secret_jwt_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
```

### Frontend — `frontend/.env`

```env
VITE_BACKEND_URL=https://your-backend-url.onrender.com
```

> ⚠️ **Never commit `.env` files.** Both are included in `.gitignore`.

---

## 📡 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive a JWT token |
| `GET` | `/api/auth/check` | ✅ | Verify token and return user data |
| `PUT` | `/api/auth/update-profile` | ✅ | Update profile picture, name, or bio |

### Message Routes — `/api/messages`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/messages/users` | ✅ | Get all users + unseen message counts |
| `GET` | `/api/messages/:id` | ✅ | Get full conversation with a specific user |
| `POST` | `/api/messages/send/:id` | ✅ | Send a text or image message |
| `PUT` | `/api/messages/mark/:id` | ✅ | Mark a specific message as seen |
| `DELETE` | `/api/messages/delete/:id` | ✅ | Delete a message |

> All protected routes require a `token` header in the request.

---

## 🔌 Real-Time Events (Socket.IO)

| Event | Direction | Description |
|---|---|---|
| `connection` | Client → Server | User connects, sends `userId` as query param |
| `getOnlineUser` | Server → All Clients | Broadcasts current array of online user IDs |
| `newMessage` | Server → Receiver | Pushes a new message to the recipient instantly |
| `messageDeleted` | Server → Both Parties | Notifies sender & receiver of a deleted message |
| `disconnect` | Client → Server | Removes user from the online users map |

---

## 🗄️ Database Schemas

### User
```js
{
  email:      String,   // unique, required
  fullName:   String,   // required
  password:   String,   // bcrypt hashed, min length 6
  profilePic: String,   // Cloudinary URL, default: ""
  bio:        String,
  timestamps: true
}
```

### Message
```js
{
  senderId:   ObjectId, // ref: User, required
  receiverId: ObjectId, // ref: User, required
  text:       String,   // optional (text message)
  image:      String,   // optional (Cloudinary URL)
  seen:       Boolean,  // default: false
  timestamps: true
}
```

---

## ☁️ Deployment on Render

### Backend (Web Service)

| Setting | Value |
|---|---|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Environment Variables** | Add all backend `.env` keys in the Render dashboard |

### Frontend (Static Site)

| Setting | Value |
|---|---|
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Publish Directory** | `dist` |
| **Environment Variables** | Set `VITE_BACKEND_URL` to your Render backend URL |

> 💡 Deploy the backend first, then copy its URL into the frontend's `VITE_BACKEND_URL` environment variable before building.

---

## 👤 Author

**Rahul Raj**
- GitHub: [@rajlucifer](https://github.com/rajlucifer)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">Made with ❤️ and lots of ☕</div>
