import React, { useEffect, useState } from "react";
import { List } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import auth from "../../auth";
import API from "../../apis/BaseUrl";
import EntityDetails from "../common/EntityDetails";

const StreamingServiceDetails = ({ match }) => {
  // console.log(`params: ${match.params.name} auth: ${auth.getUsername()}`);
  const [details, setDetails] = useState(null);
  const history = useHistory();
  useEffect(() => {
    // setActiveItem("");
    const getDetails = async () => {
      await API.get(`streamingService?name=${match.params.name}`).then(
        ({ data: stream }) => {
          if (Object.keys(stream).length !== 0) {
            setDetails({
              shortName: stream.shortName,
              longName: stream.longName,
              subPrice: stream.monthlySubscriptionRate.price,
              currentPeriod: stream.current_period.price,
              previousPeriod: stream.previous_period.price,
              total: stream.total.price,
              licensing: stream.licensingPrice.price,
            });
          }
        }
      );
    };
    getDetails();
  }, []);

  // If the logged in streaming service tries to view a different one,
  // redirect to unauthorized page
  if (
    match.params.name !== auth.getUsername() &&
    auth.getUsername() !== "admin"
  ) {
    history.push("/unauthorized");
  }

  return (
    <>
      {details !== null ? (
        <EntityDetails
          header={"Streaming Service Summary"}
          details={
            <>
              <List>
                <List.Item>
                  <strong>Long Name:</strong> {details.longName} <br />
                </List.Item>
                <List.Item>
                  <strong>Short Name:</strong> {details.shortName} <br />
                </List.Item>
                <List.Item>
                  <strong>Monthly Subscription Rate:</strong> $
                  {details.subPrice}{" "}
                </List.Item>
                <List.Item>
                  <strong>Licensing Expenses:</strong> ${details.licensing}
                </List.Item>
                <List.Item>
                  <strong>Subscription Revenues:</strong>
                  <List.List>
                    <List.Item>This month: ${details.currentPeriod}</List.Item>
                    <List.Item>Last month: ${details.previousPeriod}</List.Item>
                    <List.Item>All time: ${details.total}</List.Item>
                  </List.List>
                </List.Item>
              </List>
            </>
          }
        />
      ) : (
        <div>
          Streaming Service <strong>{match.params.name}</strong> does not exist!
        </div>
      )}
    </>
  );
};

export default StreamingServiceDetails;
