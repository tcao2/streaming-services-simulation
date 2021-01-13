import React from "react";
import { Link } from "react-router-dom";
import { Header, Segment, Icon } from "semantic-ui-react";
import auth from "../auth";
import HomeMessage from "./HomeMessage";

const Home = () => {
  const adminActions = [
    "Create studios, streaming services, and demographic groups",
    "View details of studios, streaming services, and demographic groups",
    "View events and offers",
  ];

  const demographicActions = [
    "Watch movies and PPV events",
    "Update group's info",
    "View this month's offers",
    "View group's spending",
  ];

  const studioActions = [
    "Create new events",
    "Update existing events",
    "View studio's revenues",
  ];

  const streamActions = [
    "Offer new events",
    "Retract events",
    "View streaming service's revenues and licensing expenses",
    "Update streaming service's info",
  ];
  let accountActions = [];

  const getRoleDisplayMessage = () => {
    switch (auth.getRole()) {
      case "admin":
        accountActions = adminActions;
        return "an admin";
      case "demo":
        accountActions = demographicActions;
        return "a demographic group account manager";
      case "studio":
        accountActions = studioActions;
        return "a studio account manager";
      case "stream":
        accountActions = streamActions;
        return "a streaming service account manager";
      default:
        return "";
    }
  };

  const notLoggedInMsg = (
    <p>
      To access our site, please{" "}
      <Link to="/login">
        log in <Icon name="sign in alternate" />
      </Link>{" "}
    </p>
  );

  const loggedInMsg = (
    <>
      <div>You are logged in as {getRoleDisplayMessage()}. You can:</div>
      <br />
      <div>{<HomeMessage actions={accountActions} />}</div>
    </>
  );

  return (
    <Segment color="teal">
      <Header size="medium">
        Welcome to Streaming Wars Simulation <Icon name="film" />
      </Header>
      {auth.isAuthenticated() ? loggedInMsg : notLoggedInMsg}
    </Segment>
  );
};

export default Home;
