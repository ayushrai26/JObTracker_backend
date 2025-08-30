# JOB TRACKER APPLICATION - BACKEND

# 🚀 About 

This is the Backend of JOb Tracker Application, built with Node(Express.js).
It provides REST APIs for authentication, data storage, and other business logic.

## ✨ Features
- User authentication with JWT
- CRUD operations for [Jobs/Products/etc.]
- Secure API endpoints
- Database integration with MongoDB
- Error handling & validation


## 🛠 Tech Stack
- Node.js
- Express.js
- MongoDB / Mongoose
- JWT Authentication
- bcrypt.js (for password hashing)


## ⚙️ Installation
```bash
# Clone the repo
git clone https://github.com/ayushrai26/JObTracker_backend.git
cd backend

# Install dependencies
npm install

# Start server
npm run dev


```
# Folder Structure
```
 backend
│  ├─ .env
│  ├─ cloudinary.js
│  ├─ controllers
│  │  ├─ adminController.js
│  │  ├─ authMiddleware.js
│  │  └─ userController.js
│  ├─ models
│  │  ├─ appliedApplicationsModel.js
│  │  ├─ bookmarkedJobModel.js
│  │  ├─ createNewJobModel.js
│  │  ├─ createNewUserModel.js
│  │  ├─ notificationModel.js
│  │  └─ saveApplicationStatus.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ admin.js
│  │  ├─ uploads.js
│  │  └─ users.js
│  └─ server.js
```

# Related Repositories
```
- [Frontend Repo](https://github.com/ayushrai26/JobTracker_frontend)
