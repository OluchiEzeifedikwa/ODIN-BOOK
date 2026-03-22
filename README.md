# OdinBook

A social media web application where users can connect, share posts, and interact with each other.

## Features

- Sign up and log in securely
- Create and delete posts (with image uploads)
- Like and comment on posts
- Follow and unfollow users
- View your friends list
- Edit your profile (bio, location, pronoun, profile photo)
- Search for users
- Notifications for likes, comments, and follows

## Tech Stack

- **Backend:** Node.js, Express.js
- **Templating:** EJS with express-ejs-layouts
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Passport.js (session-based)
- **File Uploads:** Multer
- **Styling:** Custom CSS

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/odin-book.git
cd odin-book
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables — create a `.env` file in the root:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/odinbook"
SESSION_SECRET="your-session-secret"
PORT=5000
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the app
```bash
npm start
```

The app will be running at `http://localhost:5000`

## Project Structure

```
ODIN-BOOK/
├── controllers/
│   ├── commentController.js
│   ├── followRequestController.js
│   ├── homeController.js
│   ├── likeController.js
│   ├── loginController.js
│   ├── notificationController.js
│   ├── postController.js
│   ├── profileController.js
│   ├── searchController.js
│   └── signupController.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorHandler.js
├── repositories/
│   ├── commentRepository.js
│   ├── followRequestRepository.js
│   ├── likeRepository.js
│   ├── notificationRepository.js
│   ├── postRepository.js
│   ├── prismaClient.js
│   ├── profileRepository.js
│   └── userRepository.js
├── routes/
│   ├── commentRouter.js
│   ├── followRequestRouter.js
│   ├── homeRouter.js
│   ├── likeRouter.js
│   ├── notificationRouter.js
│   ├── postRouter.js
│   ├── profileRouter.js
│   └── searchRouter.js
├── services/
│   ├── authService.js
│   ├── commentService.js
│   ├── followRequestService.js
│   ├── homeService.js
│   ├── likeService.js
│   ├── minutesAgo.js
│   ├── notificationService.js
│   ├── postService.js
│   ├── profileService.js
│   ├── schema.js
│   └── searchService.js
├── views/
│   ├── auth/
│   │   ├── login.ejs
│   │   └── signup.ejs
│   ├── layouts/
│   │   └── main.ejs
│   ├── pages/
│   │   ├── createPost.ejs
│   │   ├── editProfile.ejs
│   │   ├── error.ejs
│   │   ├── friends.ejs
│   │   ├── home.ejs
│   │   ├── notifications.ejs
│   │   ├── post.ejs
│   │   ├── profileDetail.ejs
│   │   └── search.ejs
│   └── partials/
│       ├── navbar.ejs
│       └── sidebar.ejs
├── public/
│   └── css/
│       └── styles.css
├── prisma/
│   └── schema.prisma
├── app.js
├── passport.js
├── Dockerfile
└── docker-compose.yml
```

## Environment Variables

| Variable         | Description                               |
|------------------|-------------------------------------------|
| `DATABASE_URL`   | PostgreSQL connection string              |
| `SESSION_SECRET` | Secret key for session encryption         |
| `PORT`           | Port the server runs on (default: 5000)   |
