const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth
const courseRoute = require("./routes").course
const passport = require("passport")
require("./config/passport")(passport)
const cors = require("cors")

// 連結MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => {
    console.log("連結到mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use("/api/user", authRoute)

// course route應該被jwt保護
// 若request header沒有jwt，則視為unauthorized
app.use("/api/courses", passport.authenticate("jwt", { session: false }), courseRoute)

app.listen(8080, () => {
  console.log("後端伺服器聆聽在port 8080...");
});