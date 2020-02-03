const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 12;

app.use(cors());
// app.use(cors({origin:true,credentials: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  port: 3308,
  user: "root",
  password: "",
  database: "users"
});

// API for registering user
app.post("/register", function(req, res) {
  console.log(res);
  // console.log(req.body);
  let { firstName, lastName, email, password } = req.body;
  console.log(firstName, lastName, email, password);

  // connecting to sql DB

  pool.getConnection(function(err, connection) {
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
      connection.query(sql, function(err, result) {
        if (err) {
          console.log(err.code);
          if (err.code === "ER_DUP_ENTRY") {
            console.log("err code entered");
            res.status(409).json({
              error: "Email Already Exists."
            });
          }
          throw err;
        } else {
          res.json({
            message: "success"
          });
        }
        connection.release();
      });
    });
  });
});

// API for user login
app.post("/login", function(req, res) {
  let { email, password } = req.body;
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    console.log("connected to DB");
    let sql = `SELECT * FROM userregister WHERE email =?`;
    let logQuery = [email];
    sql = mysql.format(sql, logQuery);
    connection.query(sql, function(err, result) {
      if (err) throw err;
      // console.log(result);
      if (result.length) {
        let user = result[0];
        console.log("got user");
        bcrypt.compare(password, user.password, function(error, hasResult) {
          if (error) {
            console.log(error);
            throw error;
          }
          if (hasResult) {
            console.log("password matched");
            res.json({
              isLogged: true,
              userFName: user.firstName,
              userLName: user.lastName,
              userEmail: user.email
            });
          } else if (!hasResult) {
            console.log("wrong password");
            res.status(401).json({
              error: "wrong password"
            });
          }
        });
      } else {
        console.log("email don't exist");
        res.status(401).json({
          error: "email does not exist"
        });
      }
      connection.release();
    });
  });
});

// Adding extra profile info
app.post("/update", function(req, res) {
  let { dob, gender, phone, about, email } = req.body;
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    console.log("Connected to DB - update");
    let sql1 = "SELECT * from userextrainfo where email = ?";
    connection.query(sql1, email, function(err, result) {
      if (err) throw err;
      console.log(result.length);
      if (result.length > 0) {
        let sql2 =
          "UPDATE userextrainfo SET gender = ?, dob = ?, phone = ?, about = ? where email = ?";
        sql2 = mysql.format(sql2, [gender, dob, phone, about, email]);
        connection.query(sql2, function(err, result) {
          if (err) throw err;
          if (result) {
            console.log(result);
            res.json({
              message: "Updated profile successfully"
            });
            connection.release();
          }
        });
      } else if (result.length < 1) {
        let updateAllQuery = { email, gender, dob, phone, about };
        sql3 = "INSERT INTO userextrainfo SET ?";
        sql3 = mysql.format(sql3, updateAllQuery);
        connection.query(sql3, function(err, result) {
          if (err) throw err;
          if (result) {
            res.json({
              message: "Added to profile Successfully"
            });
            connection.release();
          }
        });
      }
    });
  });
});
app.get("/userinfo", function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    console.log("connected to DB - userinfo");
    let sql = "SELECT * from userextrainfo where email = ?";
    connection.query(sql, [req.query.email], function(err, result) {
      if (err) throw err;
      if (result.length > 0) {
        console.log("result exist");
        res.json(result[0]);
        console.log(result[0]);
        console.log(
          "sent response to client - from userextrainfo - result exist"
        );
        // WRITING DATA TO JSON FILE
        let jsonSql =
              "SELECT * FROM `userregister` LEFT JOIN userextrainfo ON userregister.email = userextrainfo.email ORDER BY id ASC";
            connection.query(jsonSql, function(err, result) {
              if (err) throw err;
              console.log("json query");
              
              fs.writeFile('../json/users.json', JSON.stringify(result), function (err) {
                if (err) throw err;
                console.log("saved to JSON file");
              })
              connection.release();
            });
        // connection.release();
      } else if (result.length < 1) {
        console.log("result empty");
        res.json({
          message: "no info exist in DB"
        });
        connection.release();
      }
    });
  });
});

app.listen(3000, () => {
  console.log(`listening on port 3000..`);
});
