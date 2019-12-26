import React from "react";
import { Icon, Button, Form, Message, Segment } from "semantic-ui-react";
import Link from "next/link";
import catchErrors from "../utils/catchErrors";
import baseUrl from "../utils/baseUrl";
import axios from "axios";
import { handleLogin } from "../utils/auth";

const INITIAL_USER = {
  email: "",
  password: ""
};

function Login() {
  const [user, setUser] = React.useState(INITIAL_USER);
  const [disabled, setDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const isUser = Object.values(user).every(el => Boolean(el));
    isUser ? setDisabled(false) : setDisabled(true);
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
  }

  async function handleSubmit() {
    event.preventDefault();

    try {
      setError("");
      setLoading(true);
      const url = `${baseUrl}/api/login`;
      const payload = { ...user };
      const response = await axios.post(url, payload);
      handleLogin(response.data);
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  }

  React.useState();
  return (
    <>
      <Message
        attached
        icon="privacy"
        header="Welcome Back!"
        content="Login with email and password"
        color="blue"
      />
      <Form error={Boolean(error)} loading={loading} onSubmit={handleSubmit}>
        <Message error header="Opps!" content={error.response} />
        <Segment>
          <Form.Input
            fluid
            icon="envelope"
            iconPosition="left"
            type="email"
            label="Email"
            placeholder="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
          <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            label="Password"
            placeholder="Password"
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
          />
          <Button
            disabled={disabled || loading}
            icon="sign in"
            type="submit"
            color="orange"
            content="LoginIn"
          />
        </Segment>
      </Form>
      <Message attached="bottom" warning>
        <Icon name="help" />
        New User?{""}
        <Link href="/signup">
          <a> Signup in here</a>
        </Link>
        {""}Instead.
      </Message>
    </>
  );
}

export default Login;
