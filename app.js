import express from "express";
import session from "express-session";
import passport from "./passport.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import methodOverride from "method-override";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import multer from "multer";
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
import upload from "./upload.js";
import dotenv from "dotenv";
dotenv.config();



const app = express();

/* ---------------- ES module __dirname replacement ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- Static & views ---------------- */

// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files from /uploads route
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set("views", [
  path.join(__dirname, "odinbook", "views"),
  path.join(__dirname, "auth", "views"),
]);


app.set("view engine", "ejs");

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

/* ---------------- Test error route ---------------- */
app.get("/error", (req, res) => {
  throw new Error("Something went wrong");
});

console.log("Running from:", process.cwd());

app.get("/test", (req, res) => {
  res.render("index");
});

/* ---------------- Server ---------------- */
const PORT = process.env.PORT || 5000;
console.log(PORT);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening at ${PORT}`);
});
