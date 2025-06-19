import validator from "validator";
//?this file is for the validation purpose only all the validation will be done here:
const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid ....");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid ..");
  }
};
export const validateProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "gender",
    "about",
    "skills",
    "age"
  ];
   const isEditAllowed= Object.keys(req.body).every(field=> allowedEditFields.includes(field));
   return isEditAllowed; 
};
export default validateSignupData;
