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
  const user= new User(req.body);
  try {
    await user.save();
    res.send("user added successfully .....");
  } catch (error) {
    res.status(400).send("Error saving the user :"+ error.message);
  }
});
