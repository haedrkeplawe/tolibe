require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const db = "mongodb://localhost:27017/tolibe";
const db =
  "mongodb+srv://alihassanhaedr:c4a@cluster0.ue5ezcc.mongodb.net/tolibe?retryWrites=true&w=majority";
const port = process.env.PORT || 4000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { v2 } = require("cloudinary");

app.use((req, res, next) => {
  console.log(` ${req.method} , ${req.path} `);
  next();
});

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:5173","https://tolibe.netlify.app"],
  })
);
app.use(express.urlencoded({ extended: false }));

app.use("/api/admen", require("./routes/adminRoute"));
app.use("/api/user", require("./routes/userRoute"));

app.all("*", (req, res) => {
  res.status(404).json("404");
});
mongoose
  .connect(db)
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
