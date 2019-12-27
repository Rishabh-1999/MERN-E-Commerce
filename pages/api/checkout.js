import Stripe from "stripe";
import uuidv4 from "uuid/v4";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import Order from "../../models/Order";
import calculateCartTotal from "../../utils/calculateCartTotal";

const stripe = Stripe(process.env.STRIPE_SECERT_KEY);

export default async (req, res) => {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }
  const { paymentData } = req.body;

  try {
    // 1) verify and get user id
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    // 2) find cart based in user id,populate it
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product"
    });
    // 3) calculate cart totals again from cart
    const { cartTotal, stripeTotal } = calculateCartTotal(cart.products);
    // 4) get email for payement data, see if email linked with existing stripe customer
    const prevCustomer = await stripe.customers.list({
      email: paymentData.email,
      limit: 1
    });
    const isExistingCustomer = prevCustomer.data.length > 0;
    // 5) if not existing customers, create them based on their email
    let newCustomer;
    if (!isExistingCustomer) {
      newCustomer = await stripe.customers.create({
        email: paymentData.email,
        source: paymentData.id
      });
    }
    const customer =
      (isExistingCustomer && prevCustomer.data[0].id) || newCustomer.id;
    // 6) Create charge with total,send receipt email
    await stripe.charges.create(
      {
        currency: "inr",
        amount: stripeTotal,
        receipt_email: paymentData.email,
        customer,
        description: `Checkout | ${paymentData.email} | ${paymentData.id}`
      },
      {
        idempotency_key: uuidv4()
      }
    );
    // 7) Add order data to database
    await new Order({
      user: userId,
      email: paymentData.email,
      total: cartTotal,
      products: cart.products
    }).save();
    // 8) Clear Products in cart
    await Cart.findOneAndUpdate({ _id: cart._id }, { $set: { products: [] } });
    //9) send back success (200)
    res.status(200).send("Checkout successfull");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while Payment");
  }
};
