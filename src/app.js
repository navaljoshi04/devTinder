import express from "express";
import connectWithDataBase from "./config/database.js";
import User from "./models/user.js";
import bcrypt from "bcrypt";
import validateSignupData from "./utils/validation.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import userAuth from "./middleware/auth.js";
const app = express();
connectWithDataBase();

//middleware without this req.body will give undefined.
app.use(express.json());
app.use(cookieParser());
app.listen(3000, () => {
  console.log("server is succesfully listening on port 3000.....");
});

app.post("/signup", async (req, res) => {
  console.log(req.body);

  //!this was the time when we were hardcoding the values :
  //   const user = new User({
  //     firstName: "virat",
  //     lastName: "kohli",
  //     email: "viratkohli@gmail.com",
  //     password: "viratkohli",
  //   });

  try {
    //! goood way of wrting a code is validating the data nd then encrypting the password:
    validateSignupData(req);
    //password hashing:
    const { firstName, lastName, email, password, gender, age, skills } =
      req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    //? this is the dynamic way to save data from the api
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      gender,
      age,
      skills,
    });
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

//? now we need to do the login for the user:
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("invalid credentials  ....");
    }
    const isPassValid = await bcrypt.compare(password, user.password);
    if (isPassValid) {
      //! create a token and add token to the cookie and send the response back to the user:
      // const token = jwt.sign({ _id: user._id }, "secretkey@1234", {
      //   expiresIn: "7d",
      // });
      // console.log(token);
      //! yeh funtion humne schema m define krdia h toh yha pe nhi bna rhe h that is good practise
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("Login successfully to the Database ....");
    } else {
      throw new Error("invalid credentials  ...");
    }
  } catch (error) {
    res.status(400).send("error while login .." + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    // //validate the token:
    //! yeh sb m authmiddleware se krwa rha hu ab so is function m krne ki jrurat nhi h :
    // const cookies = req.cookies;
    // const { token } = cookies;
    // // console.log(cookies);
    // //!validate the token :
    // const decodedMsg = await jwt.verify(token, "secretkey@1234");
    // console.log(decodedMsg);
    // const { _id } = decodedMsg;
    // console.log("logged in user is : " + _id);
    // //? we can get the user information by this:
    // const user = await User.findById(_id);
    // if (!user) {
    //   throw new Error("user does not exist ...");
    // }
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("error" + error.message);
  }
});
