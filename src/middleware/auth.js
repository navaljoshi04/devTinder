import jwt from "jsonwebtoken";
import User from "../models/user.js";

const userAuth = async (req, res, next) => {
  //? read the token from the req cookies
  //? validate the token
  //? find the user
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token is not valid .....");
    }
    const decodeObj = await jwt.verify(token, "secretkey@1234");
    const { _id } = decodeObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found ");
    }
    req.user=user; 
    next();
  } catch (error) {
    res.status(400).send("error " + error.message);
  }
};

export default userAuth; 