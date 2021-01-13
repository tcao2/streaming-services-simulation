import React from "react";
import { Grid, Segment, Header, Divider } from "semantic-ui-react";

const EntityDetails = ({ header, details }) => {
  return (
    <Grid style={{ height: "25vh" }} centered columns={1}>
      <Grid.Column style={{ maxWidth: 600 }}>
        <Segment color="teal" piled>
          <Header size="medium" textAlign="center">
            {header}
          </Header>
          <Divider />
          <div textAlign="left">{details}</div>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default EntityDetails;
