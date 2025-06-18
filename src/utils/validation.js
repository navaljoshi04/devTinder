import validator from "validator";
//?this file is for the validation purpose only all the validation will be done here: 
const validateSignupData=(req)=>{
    const {firstName, lastName,email,password}=req.body;
    if(!firstName|| !lastName){
        throw new Error("Name is not valid ....")
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid ..")
    }
}

export default validateSignupData; 