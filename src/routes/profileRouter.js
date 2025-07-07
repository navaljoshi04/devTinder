import express from "express";
import userAuth from "../middleware/auth.js";
import { validateProfileData } from "../utils/validation.js";

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
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

//? for the edit :
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("invalid edit request ..");
    }
    const loggedinUser = req.user;
    console.log(loggedinUser);
    Object.keys(req.body).forEach((key) => (loggedinUser[key] = req.body[key]));
    console.log(loggedinUser);
    await loggedinUser.save();
    res.send(`${loggedinUser.firstName} your profile updated successfully ..`);
  } catch (error) {
    res.status(400).send("error" + error.message);
  }
});

export default profileRouter;
