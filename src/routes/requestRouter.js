import express from "express";
import userAuth from "../middleware/auth.js";

const requestRouter = express.Router();
import ConnectionRequestModel from "../models/connectionRequest.js";
import User from "../models/user.js";
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //? check only these two conditions can only come in the status :
      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type:" + status });
      }
      //! check if the user id exist in the database or not: 
      const checkexistingUser = await User.findById(toUserId);
      if(!checkexistingUser){
        return res.status(400).send({message:"user does not exist ..... "})
      } 
      //! check if there is an existing connection request :
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).send({
          message:
            "Connection request already exist ...... wait for the response !",
        });
      }
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: "Connection request sent successfully ....",
        data,
      });
    } catch (error) {
      res.status(400).send("error" + error.message);
    }
  }
);

export default requestRouter;
