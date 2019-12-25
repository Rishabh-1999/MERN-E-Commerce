import Product from "../../models/Product";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGETRequest(req, res);
      break;
    case "POST":
      handlePOSTRequest(req, res);
      break;
    case "DELETE":
      handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Method of ${req.method} not allowed`);
      break;
  }
};

async function handleGETRequest(req, res) {
  const { _id } = req.query;
  const response = await Product.findOne({
    _id
  });
  res.status(200).json(response);
}

async function handlePOSTRequest(req, res) {
  try {
    const { name, price, description, mediaUrl } = req.body;
    if (!name || !price || !description || !mediaUrl) {
      return res.status(445).send("Product missing one or more field");
    }
    const product = await new Product({
      name,
      price,
      description,
      mediaUrl
    }).save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).send("Error Creating product");
  }
}

async function handleDeleteRequest(req, res) {
  const { _id } = req.query;
  const re = await Product.deleteOne({ _id });
  res.status(204).json({});
}
