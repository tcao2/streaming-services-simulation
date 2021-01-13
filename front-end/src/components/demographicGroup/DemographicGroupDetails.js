import React, { useEffect, useState } from "react";
import { List } from "semantic-ui-react";
import { getDemographicGroupDetails } from "../../apis/Admin";
import EntityDetails from "../common/EntityDetails";
import { useHistory } from "react-router-dom";
import auth from "../../auth";

const DemographicGroupDetails = ({ match }) => {
  const [details, setDetails] = useState(null);
  const history = useHistory();
  useEffect(() => {
    getDemographicGroupDetails(match.params.name).then((details) => {
      // If we successfully get the data back from the server
      if (Object.keys(details).length !== 0) {
        setDetails({
          shortName: details.shortName,
          longName: details.longName,
          numOfAccounts: details.size,
          currentMonth: details.current_month,
          prevMonth: details.previous_month,
          allTime: details.total,
        });
      }
    });
  }, []);

  // If the logged in demographic group tries to view a different one,
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
          header={"Demographic Group Summary"}
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
                  <strong>Number of Accounts:</strong> {details.numOfAccounts}{" "}
                </List.Item>
                <List.Item>
                  <strong>Spending:</strong>
                  <List.List>
                    <List.Item>This month: ${details.currentMonth}</List.Item>
                    <List.Item>Last month: ${details.prevMonth}</List.Item>
                    <List.Item>All time: ${details.allTime}</List.Item>
                  </List.List>
                </List.Item>
              </List>
            </>
          }
        />
      ) : (
        <div>
          Demographic Group <strong>{match.params.name}</strong> does not exist!
        </div>
      )}
    </>
  );
};

export default DemographicGroupDetails;
