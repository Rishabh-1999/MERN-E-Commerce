import { Card } from "semantic-ui-react";
import react from "react";
function ProductList({ products }) {
  //console.log(products);
  function mapProductstoItems(products) {
    return products.map(product => ({
      header: product.name,
      image: product.mediaUrl,
      color: "teal",
      meta: `${product.price}`,
      fluid: true,
      childKey: product._id,
      href: `/product?_id=${product._id}`
    }));
  }

  return (
    <Card.Group
      stackable
      itemsPerRow="3"
      centered
      items={mapProductstoItems(products)}
    />
  );
}

export default ProductList;
