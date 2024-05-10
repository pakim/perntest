import bodyParser from "body-parser";
import express from "express";
import bcrypt from "bcrypt";
import pg from "pg";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
// import cors from "cors";

const app = express();
const port = 3000;
const salt = 10;

// app.use(cors());

// Postgres database setup
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "perntest",
  password: "123456",
  port: 5432,
});
db.connect();

// Express session setup
app.use(
  session({
    secret: "SESSION_SECRET",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

app.get("/api/authenticate", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.post("/api/logout", (req, res) => {
  req.logout(err => {
    if (err) {
      console.error("Error logging out", err.message);
      res.status(500).send("Error logging out");
    } else {
      res.send("Logout successful");
    }
  });
});

app.post("/api/register", async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  try {
    // Check if email already exists in the database
    const checkEmail = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkEmail.rows.length > 0) {
      console.log("Email already exists");
      res.status(400).send("Email already exists");
    } else {
      // Check if username already exists in the database
      const checkUsername = await db.query("SELECT * FROM users WHERE username = $1", [username]);

      if (checkUsername.rows.length > 0) {
        console.log("Username already exists");
        res.status(400).send("Username already exists");
      } else {
        // Secure the password by hashing
        bcrypt.hash(password, salt, async (err, hash) => {
          if (err) {
            console.error("Error hashing password:", err.message);
            res.status(500).send("Internal server error");
          } else {
            // If no problems occur, create new user in the database
            const result = await db.query(
              "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *",
              [email, username, hash]
            );
            const user = result.rows[0];

            // Log the user into the session
            req.login(user, err => {
              if (err) {
                console.error("Error with session login", err.message);
                res.status(500).send("Error logging in");
              } else {
                console.log("New user created");
                res.status(201).send("User created");
              }
            });
          }
        });
      }
    }
  } catch (err) {
    console.error("Error accessing database", err.message);
    res.status(500).send("Internal server error");
  }
});

app.post(
  "/api/login",
  passport.authenticate("local", { failureMessage: "Login failed" }),
  (req, res) => {
    res.send("Login successful");
  }
);

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const checkUsername = await db.query("SELECT * FROM users WHERE username = $1", [username]);

      if (checkUsername.rows.length > 0) {
        const user = checkUsername.rows[0];
        const hashPassword = user.password;

        bcrypt.compare(password, hashPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing password", err.message);
          } else if (valid) {
            console.log("Login successful");
            cb(null, user);
          } else {
            console.log("Login failed");
            cb(null, false);
          }
        });
      } else {
        console.error("Username does not exist");
      }
    } catch (err) {
      console.error("Internal server error", err.message);
    }
  })
);

app.get("/api/userdetails", (req, res) => {
  res.json(req.user);
});

// Serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(false, user);
});

passport.deserializeUser((user, cb) => {
  cb(false, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
