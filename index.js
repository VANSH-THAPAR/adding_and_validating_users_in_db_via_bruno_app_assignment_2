const express = require("express");
const { resolve } = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = require("./user.model.js");
const app = express();
const port = 3010;
const db_url =
  "mongodb+srv://Nidhish_Agarwal:Nidhish64364488@cluster0.tqv0w.mongodb.net/adding_validating_users";
app.use(express.static("static"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

mongoose
  .connect(db_url)
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((er) => {
    console.log("Failed to connect", er.message);
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ messgae: "Send the correct credentials" });
    }

    const users = await userModel.findOne({ email: email });

    if (!users) {
      return res.status(404).send({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, users.password);

    if (!isValid) {
      return res.status(401).send({ message: "The credentials are wrong" });
    }

    return res.status(200).send({ message: "You have sucessfully logged in " });
  } catch (er) {
    return res
      .status(500)
      .send({ message: "internal server error", error: er.message });
  }
});