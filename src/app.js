import express from "express";
import connectWithDataBase from "./config/database.js";
import User from "./models/user.js";
import bcrypt from "bcrypt";
import validateSignupData from "./utils/validation.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import userAuth from "./middleware/auth.js";
import authRouter from "./routes/authRouter.js";
import profileRouter from "./routes/profileRouter.js";
import requestRouter from "./routes/requestRouter.js";
import userRouter from "./routes/userRouter.js";
const app = express();
connectWithDataBase();

//middleware without this req.body will give undefined.
app.use(express.json());
app.use(cookieParser());


app.use("/auth",authRouter);
app.use("/profile",profileRouter);
app.use("/request",requestRouter);
app.use("/",userRouter);

app.listen(3000, () => {
  console.log("server is succesfully listening on port 3000.....");
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
app.get("/getbyID/:id", userAuth, async (req, res) => {
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
app.patch("/update/:userId", userAuth, async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  console.log(data);

  try {
    //api validations that we want :
    const allowedUpdates = ["about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Updates not allowed .....");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data);
    console.log(user);
    res.send("Updated the data successfully ......");
  } catch (error) {
    res.status(400).send("No such user exist ....");
  }
});




