const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://mern-e-commerce.now.sh/"
    : "http://localhost:3000";

export default baseUrl;
