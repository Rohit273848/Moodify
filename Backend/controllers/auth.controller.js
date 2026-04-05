import { registerUser, loginUser, getMeService, logoutService } from "../services/auth.service.js";
import { generateToken } from "../utils/token.js";


const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await registerUser({ username, email, password });
    const accessToken = generateToken(user);
    res.cookie("token", accessToken,{
      httpOnly: true,
      secure: true, // Set to true in production
      sameSite: "None", // Set to "Lax" or "Strict" in production
    });
    return res.status(201).json({
      message: "User registered",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(400).json({
      error2: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await loginUser(identifier, password);
    const accessToken = generateToken(user);
    res.cookie("token", accessToken,{
      httpOnly: true,
      secure: true, // Set to true in production
      sameSite: "None", // Set to "Lax" or "Strict" in production
    });
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getme = async (req, res) => {
  try {
    const user = await getMeService(req.user.id);

    return res.status(200).json({
      message: "User details fetched successfully",
      user
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const logout = async (req, res) => {

  try {
    await logoutService(req.cookies.token);
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export default { register, login, getme, logout };
