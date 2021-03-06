import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import Cart from "../../models/Cart";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";

connectDb();

export default async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1) validate name / email / password
    if (!isLength(name, { min: 3, max: 10 })) {
      return res.status(442).send("Name must be between 3-10 character");
    } else if (!isLength(password, { min: 6 })) {
      return res.status(442).send("Password must be atleast 6 character");
    } else if (!isEmail(email)) {
      return res.status(442).send("Email must be valid");
    }
    //2) Check if email already exist
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(442)
        .send(`User Already Exist with emailid of ${email}`);
    }
    // 3) hash password
    const hash = await bcrypt.hash(password, 10);
    // 4) create user
    const newUser = await new User({
      name,
      email,
      password: hash
    }).save();

    await new Cart({ user: newUser._id }).save();

    // 5) create token for new user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    // 6) send back token
    res.status(201).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in Sign In");
  }
};
