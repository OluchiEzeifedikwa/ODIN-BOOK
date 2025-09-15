const { Router } = require('express');
const homeRouter = Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const links = [
    { href: "/home", text: "Home", icon: "fa fa-home" },
    { href: "/explore", text: "Explore", icon: "fa fa-search"},
    { href: "/profile", text: "Profile", icon: "fa fa-user"},
    { href: "/post", text: "Post"},
    
  ];
  
  
  homeRouter.get("/",  (req, res) => {
    console.log("im here")
    res.render("../odinbook/views/index", { links: links});
  });
  
  
  
  homeRouter.get("/home", (req, res) => {
    res.render("../odinbook/views/home", { links: links});
  });
  
  homeRouter.get("/explore", (req, res) => {
    res.render("../odinbook/views/explore", { links: links});
  });
   
  homeRouter.get("/profile", (req, res) => {
    res.render("../odinbook/views/profile", { links: links});
  });
  
  homeRouter.get("/post", (req, res) => {
    res.render("../odinbook/views/posts", { links: links});
  });

  module.exports = homeRouter;
  