import StripeCheckOut from "react-stripe-checkout";
import { Button, Segment, Divider } from "semantic-ui-react";
import calculateCartTotal from "../../utils/calculateCartTotal";

function CartSummary({ products, handleCheckOut, success }) {
  const [isCartEmpty, setCartEmpty] = React.useState(false);
  const [cartAmount, setCartAmount] = React.useState(0);
  const [stripeAmount, setStripeAmount] = React.useState(0);

  React.useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(products);
    setCartAmount(cartTotal);
    setStripeAmount(stripeTotal);
    setCartEmpty(products.length === 0);
  }, [products]);

  return (
    <>
      <Divider />
      <Segment clearing size="large">
        <strong>Sub Total:</strong> ${cartAmount}
        <StripeCheckOut
          name="E-Commerce"
          amount={stripeAmount}
          image={products.length > 0 ? products[0].product.mediaUrl : ""}
          currency="INR"
          shippingAddress={true}
          billingAddress={true}
          zipCode={true}
          stripeKey="pk_test_bsQu4i2Q5M5jiIKKLLx5TCvt00tn9WU4lh"
          token={handleCheckOut}
          triggerEvent="onClick"
        >
          <Button
            disabled={isCartEmpty || success}
            icon="cart"
            color="teal"
            floated="right"
            content="Checkout"
          />
        </StripeCheckOut>
      </Segment>
    </>
  );
}

export default CartSummary;
