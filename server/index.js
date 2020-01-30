const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 12;

app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urle ncoded({extended: true}))

const con = mysql.createConnection({
  host: "localhost",
  port: 3308,
  user: "root",
  password: "",
  database: "users"
});

// API for registering user
app.post("/register", function(req, res) {
  // console.log(req);
  // console.log(req.body);
  let { firstName, lastName, email, password } = req.body;
  console.log(firstName, lastName, email, password);

  // connecting to sql DB

  con.connect(function(err) {
    if (err) throw err;
    console.log("connected to DB");
    // hashing and querying
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) throw err;
      let regQuery = {
        firstName,
        lastName,
        email,
        password: hash
      };

      let sql = `INSERT INTO userregister SET ?`;
      sql = mysql.format(sql, regQuery);
      con.query(sql, function(err, result) {
        if (err) throw err;
        // console.log(result);
          res.send("success");
        });
              con.end(function(err) {
                if (err) throw err;
                console.log("terminated connection"); // The connection is terminated now
              });
    });
  });
});

// API for user login
app.post("/login", function(req, res) {
  let { email, password } = req.body;
  con.connect(function(err) {
    if (err) throw err;
    console.log("connected to DB");
    let sql = `SELECT email, password FROM userregister WHERE email =?`;
    let logQuery = [email];
    sql = mysql.format(sql, logQuery);
    con.query(sql, function(err, result) {
      if (err) throw err;
      let user = result[0];
      bcrypt.compare(password, user.password, function(error, hasResult) {
        if (hasResult) {
          res.json({ message: "login success" });
        } else if (error) {
          res.status(403).json({ message: "wrong password" });
        }
      });
      con.end(function(err) {
        if (err) throw err;
        console.log("connection closed");
      });
    });
  });
});

app.listen(3000, () => {
  console.log(`listening on port 3000..`);
});
