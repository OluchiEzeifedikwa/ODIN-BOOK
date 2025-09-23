const express = require('express');
const session = require('express-session');
const passport = require('./passport');
const path = require("node:path");
const app = express();
const jwt = require('jsonwebtoken');
const authLogin = require('./auth/routes/loginRouter');
const authSignup = require('./auth/routes/signupRouter');
const postRouter = require('./odinbook/routes/postRouter');
const commentRouter = require('./odinbook/routes/commentRouter');
const homeRouter = require('./odinbook/routes/homeRouter');
const profileRouter = require('./odinbook/routes/profileRouter');
const { cookieJwtAuth } = require('./cookieJwtAuth');
const cookieParser = require('cookie-parser')


const assetsPath = path.join(__dirname, "public");

app.use(express.static(assetsPath));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'process.env.SECRET_KEY',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.authenticate('session'));
app.use(passport.initialize());
app.use(passport.session());
app.use(authLogin);
app.use(authSignup);
app.use(commentRouter);
app.use(postRouter);
app.use(homeRouter);
app.use(profileRouter);
app.use(cookieParser);
app.use(cookieJwtAuth);
app.use("/images", express.static("images"));



app.get('/signin', (req, res) => {
   res.render('../auth/views/index');
});

app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ message: 'Hello, '+ req.user.username });
  });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`)
})



