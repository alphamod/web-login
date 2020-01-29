const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 12;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

const con = mysql.createConnection({
  host: "localhost",
  port: 3308,
  user: "root",
  password: "",
  database: "users"
});

app.post('/register', function (req, res) {
    // console.log(req);
    // console.log(req.body);
    let { firstName, lastName, email, password } = req.body;
    console.log(firstName, lastName, email, password);

    // connecting to sql DB
    
    con.connect(function (err) {
        if (err) throw err;
        console.log("connected to DB");
        // hashing and querying
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) throw err;
            let regQuery = {
                firstName,
                lastName,
                email,
                "password": hash
            }

            let sql = `INSERT INTO userregister SET ?` 
            sql = mysql.format(sql,regQuery);
            con.query(sql, function (err, result) {
                if (err) throw err;
                // console.log(result);
                res.send({'message': result});
                con.end(function(err) {
                    if (err) throw err;
                   console.log("terminated connection") // The connection is terminated now
                });
            })
        })
    })
})

app.listen(3000, () => {
  console.log(`listening on port 3000..`);
});
