The Odin book is a social media platform that creates an opportunity for users to post, comment, like and follow friends

FEATURES
This app can be used to 
Sign up
Sign in
Create Posts
Create comments 
Like/Unlike posts
Like/Unlike comments
Search for friends
Add friends

RESOURCES
Kindly install the resources below: 
@prisma/client
bcryptjs
cookie-parser
dotenv
ejs
express
express-session
jsonwebtoken
multer
parser
passport
passport-jwt
passport-local
pg

HOW TO RUN THE APP LOCALLY
Clone the repository
Navigate to the project directory by running cd ODIN-BOOK
Run npm install
To set up Prisma Client with PostgreSQL, you'll need to install the following packages, run npm install @prisma/client and npm install prisma --save-dev
Initialize Prisma by running npx prisma init.This will create a prisma directory with a schema.prisma file.
Configure the Postgresql database int prisma schema file
To generate the Prisma client, run npx prisma migrate dev --name init and 
npx prisma generate
Visit https://localhost:5000 to view the app in the browser


TESTS
You can test the app by running node --watch app.js