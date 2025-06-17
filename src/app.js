import express from "express";
import connectWithDataBase from "./config/database.js";
import User from "./models/user.js";
const app = express();
connectWithDataBase();

app.listen(3000, () => {
  console.log("server is succesfully listening on port 3000.....");
});

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "virat",
    lastName: "kohli",
    email: "viratkohli@gmail.com",
    password: "viratkohli",
  });

  try {
    await user.save();
    res.send("user added successfully .....");
  } catch (error) {
    res.status(400).send("Error saving the user :"+ error.message);
  }
});
