import mongoose from "mongoose";


const userSchema=mongoose.Schema({

    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
    },
    password:{
        type:String,
    },
    gender:{
        type:String
    },
    email:{
        type:String,
    }
})

const User= mongoose.model("User",userSchema);
export default User;
