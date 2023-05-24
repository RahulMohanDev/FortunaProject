// console.log("checking nodemon functionality")
// const express = require("express");
// const session = require("express-session");
import express from "express";
import session from "express-session";
// redis
import { createClient } from "redis";
import RedisStore from "connect-redis";

const app = express();
const port = 3000;

// if you want to use redis as session store
// connect to redis
let redisClient = createClient();
redisClient.connect().then(()=>{console.log("connect to redis")}).catch(console.error);

// initialize redis store
let redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
})

// if you want to use mongo as session store


// Configure session middleware
app.use(
  session({
    store: redisStore,
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Login route
app.get("/login", (req, res) => {
  res.send("Please login");
});

// Authentication route
app.post("/api/v1/login", (req, res) => {
  // Authenticate the user (e.g., check credentials against a database)
  // If authentication is successful, set isAuthenticated to true in the session
  req.session.isAuthenticated = true;
  res.send("you are logged it");
});

// Protected route
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.send("Welcome to the dashboard!");
});

// Logout route
app.get("/api/v1/logout", (req, res) => {
  // Destroy the session and redirect to the login page
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
