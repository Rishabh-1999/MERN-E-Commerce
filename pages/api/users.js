import User from "../../models/User";
import jwt from "jsonwebtoken";

export default async (req, res) => {
  try {
    const { userId } = jwt.verify(req.headers.authorization, "IAmBatman");
    const users = await User.find({ _id: { $ne: userId } }).sort({
      name: "asc"
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please Login again");
  }
};
