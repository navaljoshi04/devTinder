import express from "express";
import User from "../models/user";
import bcrypt from 'bcrypt';

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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


//? now we need to do the login for the user:
authRouter.post("/login", async (req, res) => {
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

export default authRouter;
