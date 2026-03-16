import express from "express";
import session from "express-session";
import passport from "./passport.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import authSignup from "./auth/routes/signupRouter.js";
import authLogin from "./auth/routes/loginRouter.js";
import postRouter from "./odinbook/routes/postRouter.js";
import commentRouter from "./odinbook/routes/commentRouter.js";
import homeRouter from "./odinbook/routes/homeRouter.js";
import profileRouter from "./odinbook/routes/profileRouter.js";
import likeRouter from "./odinbook/routes/likeRouter.js";
import followRequestRouter from "./odinbook/routes/followRequestRouter.js";
import notificationRouter from "./odinbook/routes/notificationRouter.js";
import errorHandler from "./odinbook/middleware/errorHandler.js";
import expressLayouts from "express-ejs-layouts";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const prisma = new PrismaClient();

const app = express();

/* ---------------- ES module __dirname replacement ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- Static & Views ---------------- */
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set("views", [
  path.join(__dirname, "odinbook", "views"),
  path.join(__dirname, "auth", "views"),
]);

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main");

/* ---------------- CORS ---------------- */
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

/* ---------------- Middleware ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(flash());
app.use(methodOverride("_method"));

/* ---------------- Global locals ---------------- */
// This ensures 'title', 'user', 'links', and 'unreadCount' exist for all templates
app.use(async (req, res, next) => {
  res.locals.title = "Odin Book";
  res.locals.user = req.user || null;
  res.locals.links = [
    { href: '/home', text: 'Home', icon: 'fa-solid fa-house' },
    { href: '/profiles', text: 'Friends', icon: 'fa-solid fa-users' },
    { href: '/createPost', text: 'Create Post', icon: 'fa-solid fa-pen-to-square' },
    { href: '/notifications', text: 'Notifications', icon: 'fa-solid fa-bell' },
  ];
  res.locals.unreadCount = 0;
  res.locals.currentUserProfile = null;
  if (req.user) {
    try {
      const [count, profile] = await Promise.all([
        prisma.notification.count({ where: { userId: req.user.id, read: false } }),
        prisma.profile.findUnique({ where: { userId: req.user.id }, select: { image: true, id: true } }),
      ]);
      res.locals.unreadCount = count;
      res.locals.currentUserProfile = profile;
    } catch (_) {}
  }
  next();
});

/* ---------------- Routes ---------------- */
app.use(authLogin);
app.use(authSignup);
app.use(profileRouter);
app.use(commentRouter);
app.use(postRouter);
app.use(homeRouter);
app.use(likeRouter);
app.use(followRequestRouter);
app.use(notificationRouter);

/* ---------------- Error handling ---------------- */
app.use(errorHandler);

/* ---------------- Test routes ---------------- */
app.get("/error", (req, res) => {
  throw new Error("Something went wrong");
});

app.get("/test", (req, res) => {
  res.render("index");
});

/* ---------------- Server ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening at ${PORT}`);
});