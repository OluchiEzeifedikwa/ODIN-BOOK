const { Router } = require('express');
const homeRouter = Router();

const links = [
    { href: "/home", text: "Home", icon: "fa fa-home" },
    { href: "/profiles", text: "Profile", icon: "fa fa-user"},
    { href: "/createPost", text: "Posts"},
    
  ];
  
  homeRouter.use((req, res, next) => {
    res.locals.links = links;
    next();
  });

  homeRouter.get("/",  (req, res) => {
    console.log("im here")
    res.render("../odinbook/views/index");
  });
  
  
  
  homeRouter.get("/home", (req, res) => {
    console.log('pls')
    res.render("../odinbook/views/home");
  });
  
   
  homeRouter.get("/profile", (req, res) => {
    console.log('hello')
    res.render("../odinbook/views/profile" );
  });
  
  
  homeRouter.get("/createPost", (req, res) => {
    console.log("passs")
    res.render("../odinbook/views/createPost");
  });

  module.exports = homeRouter;
  