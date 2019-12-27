import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

connectDb();

export default async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1) check to see if a user exists
    const user = await User.findOne({ email }).select("+password");
    // 2) if not , return error
    if (!user) {
      return res.status(404).send("No User Exists by given emailId");
    }
    //3 ) check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    // 4) generate token
    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
      });
      res.status(200).json(token);
    } else {
      res.status(401).send("Password do not match");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in User");
  }
};
