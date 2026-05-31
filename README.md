# CrackIt Platform

CrackIt is a comprehensive, production-ready full-stack learning platform designed to provide rigorous mock tests, AI-assisted mentorship, current affairs updates, and study materials for competitive exams.

## Features

- **Robust Authentication:** Secure JWT-based authentication with role-based access control (Admin/Student).
- **Comprehensive Dashboards:** Tailored dashboards for Administrators to monitor platform metrics and for Students to track their learning progress.
- **Mock Tests Engine:** Full-fledged exam simulation with timer, interactive questions, and detailed attempt analysis.
- **AI Mentor:** Integrated AI conversational tutor capable of explaining complex topics and providing customized study paths.
- **Content Library:** Centralized repository for Study Materials, Previous Papers, and Current Affairs.
- **Exam Updates:** Real-time push for notifications and status regarding upcoming competitive exams.
- **Dark Mode Support:** Fully responsive, accessible, and aesthetically premium Dark Mode integration.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, Recharts, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **AI Integration:** Groq API (Llama 3.3 for conversational AI Mentor)

## Architecture

The application follows a standard MERN stack architecture. The backend is an Express REST API serving structured JSON, secured by JWT middleware. The frontend is a React Single Page Application (SPA) utilizing modular components, context-based state management, and optimized routing (via React Router).

## Installation & Run Locally

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas cluster (or local MongoDB)

### Environment Variables
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
```

Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Steps

1. Clone the repository
2. Install Server dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install Client dependencies:
   ```bash
   cd client
   npm install
   ```
4. Start the development servers:
   - Server: `npm run dev`
   - Client: `npm run dev`

## Deployment

- **Frontend:** Optimized for deployment on Vercel or Netlify. Ensure `VITE_API_URL` is set to the production backend URL.
- **Backend:** Optimized for deployment on Render, Heroku, or DigitalOcean. Ensure `FRONTEND_URL` matches the production client URL for strict CORS handling.

## License

This project is proprietary and confidential.

## Future Roadmap

- Advanced Peer-to-Peer Leaderboards
- Video Course Integration
- Mobile Application (React Native)
