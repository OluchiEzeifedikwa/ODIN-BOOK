const express = require('express');
const session = require('express-session');
const passport = require('./passport');
const path = require("node:path");
const methodOverride = require('method-override');
const app = express();
const jwt = require('jsonwebtoken');
const authSignup = require('./auth/routes/signupRouter');
const authLogin = require('./auth/routes/loginRouter');
const postRouter = require('./odinbook/routes/postRouter');
const commentRouter = require('./odinbook/routes/commentRouter');
const homeRouter = require('./odinbook/routes/homeRouter');
const profileRouter = require('./odinbook/routes/profileRouter');
const errorHandler = require('./odinbook/middleware/errorHandler')
const cookieParser = require('cookie-parser');
const multer = require('multer');
const upload = require('./upload');



const assetsPath = path.join(__dirname, "views");


app.use(express.static(assetsPath));
// Serve static files from the 'public' directory
app.use(express.static('public'));
console.log(assetsPath);

app.use(express.static('uploads'));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static("uploads"));
app.use(authLogin);
app.use(authSignup);
app.use(profileRouter);
app.use(commentRouter);
app.use(postRouter);
app.use(homeRouter);
app.use(methodOverride('_method'));



app.use((err, req, res, next) => {
  console.error(err); // Log the error
  const statusCode = err.statusCode || 500;
  const error = statusCode === 404 ? err.message : 'An internal server error occurred';
  
  if (statusCode === 404) {
    res.status(statusCode).render("../odinbook/views/error", { error });
  }
});

app.get('/error', (req, res) => {
  throw new Error('Something went wrong')
})

app.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        likes: true,
      },
    });
    res.render('post', { post });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching post');
  }
});




app.use(cookieParser);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`)
})



