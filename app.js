const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require("node:path");
const app = express();
const jwt = require('jsonwebtoken');
const passportjs = require('./auth/routes/passport');
// // const PrismaSessionStore = require('./prisma-session-store');
// // const sessionStore = new PrismaSessionStore();
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const multer = require('multer');
// const bcrypt = require('bcryptjs');
// const upload = multer({ dest: './uploads/' });
const authLogin = require('./auth/routes/loginRouter');
const authSignup = require('./auth/routes/signupRouter');
// const commentRouter = require('./blogWebsite/routes/commentRouter');
// const postRouter = require('./blogWebsite/routes/postRouter');
// const fileRouter = require('./routes/fileRouter');
// const folderRouter = require('./routes/folderRouter');
// const methodOverride = require('method-override');




app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'jok',
    // store: sessionStore,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(authLogin);
app.use(authSignup);
// app.use(commentRouter);
// app.use(postRouter);
// app.use(methodOverride('_method'))
// app.use(passportjs);
// app.use(fileRouter);
// app.use(folderRouter);


app.get('/', (req, res) => {
   res.render('../book/views/index');
});



// app.get('/createComment', async (req, res) => {
//   try {
//     const response = await fetch('http://localhost:5000/api/posts');
//     const posts = await response.json();
//     res.render('../blogWebsite/views/createComment', { posts });
//   } catch (error) {
//     console.error('Error:', error);
//   }
// });








// Middleware to verify token on incoming requests
// app.use((req, res, next) => {
//   const token = req.header('Authorization');

//   if (!token) {
//     return res.status(401).send('Access denied. No token provided.');
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     req.user = decoded;
//     next();
//   } catch (ex) {
//     res.status(400).send('Invalid token.');
//   }
// });

// // Protected route
// app.get('/protected', (req, res) => {
//   res.send(`Hello, ${req.user.userId}!`);
// });

// app.get('/login', (req, res) => {
//   res.render('../auth/views/login');
// })

// app.get('/signup', (req, res) => {
//   res.render('signup');
// })



// app.post('/signup', async(req, res) => {
//   const {username, password} = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10) 
//   try {
//     const user = await prisma.user.create({ data: {username, password: hashedPassword }});
//     res.send(`User Created successfully: ${user.username}`);
//   } catch (error) {
//     res.status(500).send({message: 'Error Creating User'});
//   }
// });
  
// app.post('/login', passport.authenticate('local', {
//   successRedirect: '/upload',
//   failureRedirect: '/login',
  
// }));



const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
    console.log(`Server listening at ${PORT}`)
})



