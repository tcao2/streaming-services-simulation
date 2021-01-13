import React, { useState } from "react";
import auth from "../auth";
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
  Message,
} from "semantic-ui-react";
import useInputState from "../hooks/useInputState";

const Login = (props, setActiveItem) => {
  const [username, setUserName] = useInputState("");
  const [password, setPassword] = useInputState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [roleError, setRoleError] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [formLoader, setFormLoader] = useState(false);
  const roleOptions = [
    { key: "admin", text: "Admin", value: "admin" },
    { key: "demo", text: "Demographic Group", value: "demo" },
    { key: "studio", text: "Studio", value: "studio" },
    { key: "stream", text: "Streaming Service", value: "stream" },
  ];
  const [role, setRole] = useState("");

  /**
   * Clear all input fields errors
   */
  const clearFieldErrors = () => {
    setAuthError(false);
    setUsernameError(false);
    setPasswordError(false);
    setRoleError(false);
  };

  // console.log("props in login: ", props.location.state);
  /**
   * Handle login button click
   */
  const handleLogIn = async () => {
    clearFieldErrors();

    if (username === "") {
      setUsernameError(true);
      return;
    }
    if (password === "") {
      setPasswordError(true);
      return;
    }
    if (role === "") {
      setRoleError(true);
      return;
    }

    setFormLoader(true);

    // Need to do await since auth.login is a promise
    const loginSuccess = await auth.login(username, password, role, () => {
      setAuthError(false);
      if (props.location.state) {
        const prevLocation = props.location.state.prevLocation;
        let activeItem =
          prevLocation.slice(1).trim().charAt(0).toUpperCase() +
          prevLocation.slice(2);
        props.history.push(prevLocation);
        setActiveItem(activeItem);
      } else {
        props.history.push("/home");
        setActiveItem("Home");
      }
    });

    if (!loginSuccess) {
      setFormLoader(false);
      setAuthError(true);
    }
  };

  // If the user tries to access a protected page, the msg will be "Please log in first"
  const formTitle = props.location.state ? "Please log in first!" : "Log in";

  if (auth.isAuthenticated()) {
    return <div>You are already logged in!</div>;
  }
  return (
    <Grid textAlign="center" style={{ height: "50vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Segment color="teal" raised>
          <Header as="h2" color="teal" textAlign="center">
            {formTitle}
          </Header>
          <Form loading={formLoader} error={authError} size="large">
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Username"
              value={username}
              onChange={setUserName}
              error={
                usernameError
                  ? {
                      content: "Please enter a username",
                      pointing: "above",
                    }
                  : null
              }
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              value={password}
              onChange={setPassword}
              error={
                passwordError
                  ? {
                      content: "Please enter a password",
                      pointing: "above",
                    }
                  : null
              }
            />
            <Form.Select
              fluid
              options={roleOptions}
              placeholder="Log in as"
              value={role}
              onChange={(e, data) => setRole(data.value)}
              error={
                roleError
                  ? {
                      content: "Please select a role!",
                      pointing: "above",
                    }
                  : null
              }
            />
            <Button onClick={handleLogIn} color="teal" fluid size="large">
              Login
            </Button>
            <Message error content="Invalid credentials!" />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
