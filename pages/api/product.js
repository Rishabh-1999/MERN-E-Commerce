import Product from "../../models/Product";

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      console.log("GET");
      await handleGETRequest(req, res);
      break;
    case "DELETE":
      handleDeleteRequest(req, res);
      break;
    default:
      console.log("no");
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

async function handleDeleteRequest(req, res) {
  const { _id } = req.query;
  const re = await Product.deleteOne({ _id });
  console.log(req.query);
  res.status(204).json({});
}
