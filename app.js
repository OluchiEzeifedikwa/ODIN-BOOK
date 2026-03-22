import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "./passport.js";

const PgSession = connectPgSimple(session);
import path from "node:path";
import { fileURLToPath } from "node:url";
import methodOverride from "method-override";
import flash from "connect-flash";
import authSignup from "./routes/signupRouter.js";
import authLogin from "./routes/loginRouter.js";
import postRouter from "./routes/postRouter.js";
import commentRouter from "./routes/commentRouter.js";
import homeRouter from "./routes/homeRouter.js";
import profileRouter from "./routes/profileRouter.js";
import likeRouter from "./routes/likeRouter.js";
import followRequestRouter from "./routes/followRequestRouter.js";
import notificationRouter from "./routes/notificationRouter.js";
import searchRouter from "./routes/searchRouter.js";
import errorHandler from "./middleware/errorHandler.js";
import expressLayouts from "express-ejs-layouts";
import cors from "cors";
import dotenv from "dotenv";
import { countNotifications } from "./repositories/notificationRepository.js";
import { findProfileByUserId } from "./repositories/profileRepository.js";
dotenv.config();

const app = express();

/* ---------------- ES module __dirname replacement ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- Static & Views ---------------- */
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set("views", path.join(__dirname, "views"));

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
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
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
        countNotifications({ where: { userId: req.user.id, read: false } }),
        findProfileByUserId(req.user.id, { select: { image: true, id: true } }),
      ]);
      res.locals.unreadCount = count;
      res.locals.currentUserProfile = profile;
    } catch (_) {}
  }
  next();
});

/* ---------------- Current user profile redirect ---------------- */
app.get('/profile', async (req, res) => {
  if (!req.user) return res.redirect('/login');
  const profile = await findProfileByUserId(req.user.id);
  if (profile) return res.redirect(`/editProfile/${profile.id}`);
  res.redirect('/home');
});

/* ---------------- Logout ---------------- */
app.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/login');
  });
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
app.use(searchRouter);

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