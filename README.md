# Crackit - TNPSC Preparation Platform

Crackit is a modern, premium EdTech platform specifically designed for TNPSC (Tamil Nadu Public Service Commission) exam preparation. It features a robust administration dashboard for managing content and a dynamic, distraction-free student portal for learning and practice.

## 🚀 Features

### Student Portal (User Dashboard)
- **Practice Center:** Take daily challenges, subject-wise quizzes, and full-length Mock Tests.
- **Test Interface:** A state-of-the-art test engine with a countdown timer, question palette (Answered, Unanswered, Marked for Review), and instant grading.
- **Detailed Analytics:** Get deep insights into past attempts with a detailed question-by-question breakdown, including correct/incorrect highlights and explanations.
- **Study Library:** Browse and access study materials and PDFs for various subjects.
- **Previous Year Papers:** View and download official past papers for all TNPSC categories (Group 1, 2, 4, VAO, etc.).
- **Premium UI:** Built with Framer Motion and Tailwind CSS for a responsive, modern glassmorphism aesthetic with Dark Mode support.

### Admin Dashboard
- **Mock Test Management:** Create, publish, and manage tests.
- **Question Bank Bulk Upload:** Easily drag-and-drop CSV or Excel (`.xlsx`) files to instantly populate hundreds of questions into the database.
- **Study Library & Paper Management:** Upload, link, and categorize PDFs securely using Google Drive integration.
- **User Management:** Monitor active registrations, track student progress, and manage candidate accounts.
- **Operations Control:** Real-time metrics and toggles to control module visibility.

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Framer Motion (Animations)
- React Router DOM
- Lucide React (Icons)

**Backend:**
- Node.js & Express.js
- MongoDB Atlas & Mongoose
- JSON Web Token (JWT) Authentication
- Multer & XLSX (For Bulk Upload processing)

## 📦 Project Structure

```text
Crack_It/
├── client/          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI elements
│   │   ├── pages/       # Admin & User Page Views
│   │   ├── layouts/     # Dashboard Wrappers
│   │   └── services/    # API calls to backend
├── server/          # Node.js Backend
│   ├── models/      # Mongoose Schemas (User, Question, Test, etc.)
│   ├── controllers/ # Business logic
│   ├── routes/      # Express API routes
│   └── middleware/  # JWT Auth & Admin protection
```

## ⚙️ Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI

### 1. Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `server` directory with:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server: `npm run dev`

### 2. Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`

The frontend will run on `http://localhost:5173` and automatically proxy API requests to the backend.
