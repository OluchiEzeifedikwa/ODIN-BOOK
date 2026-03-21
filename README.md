OdinBook
A social media web application where users can connect, share posts, and interact with each other.

Features
Sign up and log in securely
Create and delete posts (with image uploads)
Like and comment on posts
Follow and unfollow users
View your friends list
Edit your profile (bio, location, pronoun, profile photo)
Search for users
Real-time notifications for likes, comments, and follows
Tech Stack
Backend: Node.js, Express.js
Templating: EJS with express-ejs-layouts
Database: PostgreSQL with Prisma ORM
Authentication: Passport.js (session-based)
File Uploads: Multer
Styling: Custom CSS
Getting Started
Prerequisites
Node.js (v18+)
PostgreSQL
Installation
Clone the repository

git clone https://github.com/your-username/odin-book.git
cd odin-book
Install dependencies

npm install
Set up environment variables — create a .env file in the root:

DATABASE_URL="postgresql://user:password@localhost:5432/odinbook"
SESSION_SECRET="your-session-secret"
PORT=5000
Run database migrations

npx prisma migrate dev
Start the app

npm start
The app will be running at http://localhost:5000

Project Structure

├── controllers/      # Request handlers
├── services/         # Business logic
├── repositories/     # Database queries (Prisma)
├── routes/           # Express routers
├── views/            # EJS templates
├── middleware/        # Auth and error handling
├── public/           # Static assets (CSS, images)
├── uploads/          # User uploaded files
└── prisma/           # Database schema and migrations
Environment Variables
Variable	Description
DATABASE_URL	PostgreSQL connection string
SESSION_SECRET	Secret key for session encryption
PORT	Port the server runs on (default: 5000)
