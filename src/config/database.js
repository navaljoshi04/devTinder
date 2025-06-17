import mongoose from "mongoose";

const connectWithDataBase = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/devTinder");
    console.log("mongodb is connect succesfully to the database");
  } catch (error) {
     console.log("error while connecting with the databsae :", error.message);
     process.exit(1);
  }
};

export default connectWithDataBase;