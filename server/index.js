const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");

app.listen(3000, () => {
  console.log(`listening on port 3000..`);
});
