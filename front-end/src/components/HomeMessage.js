import React from "react";
import { List } from "semantic-ui-react";

const HomeMessage = ({ actions }) => {
  const actionList = actions.map((action, idx) => {
    return <List.Item key={idx}>{action}</List.Item>;
  });
  return <List bulleted>{actionList}</List>;
};

export default HomeMessage;
