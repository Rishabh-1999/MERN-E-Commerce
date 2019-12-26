import React from "react";
import { Icon, Button, Form, Message, Segment } from "semantic-ui-react";
import Link from "next/link";
import axios from "axios";
import catchErrors from "../utils/catchErrors";
import baseUrl from "../utils/baseUrl";
import { handleLogin } from "../utils/auth";

const INITIAL_USER = {
  name: "",
  email: "",
  password: ""
};

function Signup() {
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
      const url = `${baseUrl}/api/signup`;
      const payload = { ...user };
      const response = await axios.post(url, payload);
      handleLogin(response.data);
    } catch (error) {
      await catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  }

  React.useState();
  return (
    <>
      <Message
        attached
        icon="setting"
        header="Get Started"
        content="Create a new account"
        color="teal"
      />
      <Form error={Boolean(error)} loading={loading} onSubmit={handleSubmit}>
        <Message error header="Opps!" content={error.response} />
        <Segment>
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            label="Name"
            placeholder="Name"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
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
            icon="signup"
            type="submit"
            color="orange"
            content="Signup"
          />
        </Segment>
      </Form>
      <Message attached="bottom" warning>
        <Icon name="help" />
        Existing User?{""}
        <Link href="/login">
          <a>Log in here</a>
        </Link>
        {""}Instead.
      </Message>
    </>
  );
}

export default Signup;
