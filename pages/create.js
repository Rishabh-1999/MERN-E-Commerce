import React from "react";
import {
  Form,
  Input,
  TextArea,
  Button,
  Icon,
  Image,
  Message,
  Header
} from "semantic-ui-react";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";

const INITIAL_PRODUCT = {
  name: "",
  price: "",
  media: "",
  description: ""
};

function CreateProduct() {
  const [product, setProduct] = React.useState(INITIAL_PRODUCT);
  const [mediaPreview, setMediaPreview] = React.useState("");
  const [sucess, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const isProduct = Object.values(product).every(el => Boolean(el));
    isProduct ? setDisabled(false) : setDisabled(true);
  }, [product]);

  function handleChange(event) {
    const { name, value, files } = event.target;
    if (name === "media") {
      setProduct(prevState => ({
        ...prevState,
        media: files[0]
      }));
      setMediaPreview(window.URL.createObjectURL(files[0]));
    } else {
      setProduct(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  }

  async function handleImageUpload() {
    const data = new FormData();
    data.append("file", product.media);
    data.append("upload_preset", "reactreserve");
    data.append("cloud_name", "da85drjpd");
    var response = await axios.post(process.env.CLOUDINARY_URL, data);
    const mediaURL = response.data.url;
    return mediaURL;
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      setLoading(true);
      setError("");
      const mediaUrl = await handleImageUpload();
      const url = `${baseUrl}/api/product`;
      const { name, price, description } = product;
      const payload = {
        name,
        price,
        description,
        mediaUrl
      };
      console.log(payload);
      const response = await axios.post(url, payload);
      console.log(response);
      setProduct(INITIAL_PRODUCT);
      setSuccess(true);
    } catch (error) {
      await catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header as="h2" block>
        <Icon name="add" color="orange" />
        Create New Product
      </Header>
      <Form
        loading={loading}
        error={Boolean(error)}
        success={sucess}
        onSubmit={handleSubmit}
      >
        <Message error header="Opps!!" content={error.response} />
        <Message
          success
          icon="check"
          header="Success!"
          content="Your Product has been posted"
        />
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            name="name"
            label="Name"
            value={product.name}
            placeholder="Name"
            onChange={handleChange}
          />
          <Form.Field
            control={Input}
            name="price"
            label="Price"
            placeholder="Price"
            value={product.price}
            min="0.00"
            step="0.01"
            type="number"
            onChange={handleChange}
          />
          <Form.Field
            control={Input}
            name="media"
            type="file"
            label="Media"
            accept="image/*"
            content="Select Image"
            onChange={handleChange}
          />
        </Form.Group>
        <Image src={mediaPreview} rounded centered size="small" />
        <Form.Field
          control={TextArea}
          name="description"
          label="Description"
          value={product.description}
          placeholder="Description"
          onChange={handleChange}
        />
        <Form.Field
          control={Button}
          color="blue"
          disabled={loading || disabled}
          icon="pencil alternate"
          content="Submit"
          type="submit"
        />
      </Form>
    </>
  );
}

export default CreateProduct;
