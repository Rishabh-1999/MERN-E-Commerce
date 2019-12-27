const baseUrl =
  process.envNODE_ENV === "production"
    ? "mern-e-commerce-58tx4bofo.now.sh"
    : "http://localhost:3000";

export default baseUrl;
