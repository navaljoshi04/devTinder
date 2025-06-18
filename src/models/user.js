import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 25,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female"].includes(value)) {
          throw new Error("Gender data is not valid ..");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "this is the default value",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "secretkey@1234", {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("User", userSchema);
export default User;
