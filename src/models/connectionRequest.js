import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: `{VALUE} is not supported`,
      },
    },
  },
  {
    timestamps: true,
  }
);

//this is compound interst used to make the queries very fast ... 
connectionRequestSchema.index({fromUserId: 1, toUserId:1});

//? when we are using this methods in schemas premethods they should be normal fucntion not arrow function: 
connectionRequestSchema.pre("save", function(next){
  const connectionRequest= this; 
  //check if fromUserId is same as to userID; 
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Can not send connection request to yourself ....");
  }
  next();
})
const ConnectionRequestModel= new mongoose.model(
    "ConnectionRequest", connectionRequestSchema
);
export default ConnectionRequestModel; 