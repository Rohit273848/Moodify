import bcrypt from "bcrypt";
import userModel from "../models/auth.models.js";

export const registerUser = async ({ username, email, password }) => {

  const isAlreadyExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if(isAlreadyExist){
    throw new Error("User with this email or username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  return user;
};

export const loginUser = async (identifier, password) => {
  // 1. Check if input is email or username
  const isEmail = identifier.includes("@");
  // 2. Find user accordingly
  const user = await userModel.findOne(
    isEmail
      ? { email: identifier }
      : { username: identifier }
  ).select("+password"); // Include password for comparison

  if (!user){
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch){
    return res.status(400).json({
      message:"Invalid credentials"
    })
  }

  return user;
};

export const getMeService = async (id)=>{
  const user = await userModel.findById(id);
  if(!user){
    throw new Error("User not found");
  }
  return user;
}