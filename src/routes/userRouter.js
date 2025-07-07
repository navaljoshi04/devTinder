import express from "express";
import userAuth from "../middleware/auth.js";
import ConnectionRequestModel from "../models/connectionRequest.js";
import User from "../models/user.js";

const userRouter = express.Router();

const userSafeData = "firstName lastName skills gender age about";
//? job of this api is to get the connection request for the loggedin user :

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", userSafeData);
    res.json({
      message: "Data  fetched successfully ",
      data: connectionRequest,
    });
  } catch (error) {}
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", userSafeData)
      .populate("toUserId", userSafeData);
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data: data });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//? feed api to get all the profiles to the user :
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    //ism yeh jo user loggedin use khali wo user dikhe jo usne req nhi bheje h nd uska bhi nhi dikhe jo usne ignore krdie h nd wo bhi nhi dikhe jo usne interested krdie h also you should not see the people who are u connected with and use khud ka card bhi na dikhe :
    //?0. his own card:
    //?1. user shouldnot see his own card:
    //?2. user should not see his connection card which are his connection as of now:
    //?3. user should not see the

    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit>50?50:limit; 
    const skip = (page - 1) * limit;
    //find all the connection req that are sent or recieved :
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    console.log("thsi is the user that i have to hide", hideUserFromFeed);
    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(userSafeData)
      .skip(skip)
      .limit(limit);
    console.log("this is the filtered array", user);
    res.send(user);
  } catch (error) {
    res.send(400).status("error: " + error.message);
  }
});
export default userRouter;
