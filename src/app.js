import express from "express";
import connectWithDataBase from "./config/database.js";
import User from "./models/user.js";
const app = express();
connectWithDataBase();

//middleware without this req.body will give undefined.
app.use(express.json());
app.listen(3000, () => {
  console.log("server is succesfully listening on port 3000.....");
});

app.post("/signup", async (req, res) => {
  console.log(req.body);
  //?this was the time when we were hardcoding the values :
  //   const user = new User({
  //     firstName: "virat",
  //     lastName: "kohli",
  //     email: "viratkohli@gmail.com",
  //     password: "viratkohli",
  //   });
  //? this is the dynamic way to save data from the api
  const user = new User(req.body);
  try {
    await user.save();
    res.send("user added successfully .....");
  } catch (error) {
    res.status(400).send("Error saving the user :" + error.message);
  }
});

//find the user by email :
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.find({ email: userEmail });
    if (user.length === 0) {
      res.status(404).send("No available user exists with such mail id ......");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//? this is the api where i can get all the user from the api:
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//? this is the command where we can get the user by id:
app.get("/getbyID/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (error) {
    res.status(400).send("No such user exist ....");
  }
});

//? this is the api to delete the user:
app.delete("/deleteUser", async (req, res) => {
  try {
    const userID = req.body.userID;
    const user = await User.findByIdAndDelete(userID);
    res.send("User deleted Successfully" + user);
  } catch (error) {
    res.status(400).send("No such user exist ....");
  }
});

//? update the data from the database:
app.patch("/update", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  console.log(data);
  try {
    await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("Updated the data successfully ......");
  } catch (error) {
    res.status(400).send("No such user exist ....");
  }
});
