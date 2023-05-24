// console.log("checking nodemon functionality")
const express = require("express");
const session = require("express-session");

const app = express();
const port = 3000;

// Configure session middleware
app.use(
  session({
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
