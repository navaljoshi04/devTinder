import express from "express";
import userAuth from "../middleware/auth.js";

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("Sending a connection requuest");
  req.setEncoding(user.firstName + "send the connect request ....");
});

export default requestRouter;
