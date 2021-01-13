import React, { useEffect, useState } from "react";
import { List } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import auth from "../../auth";
import API from "../../apis/BaseUrl";
import EntityDetails from "../common/EntityDetails";

const StudioDetails = ({ match }) => {
  const [details, setDetails] = useState(null);
  const history = useHistory();
  useEffect(() => {
    // setActiveItem("");
    const getDetails = async () => {
      await API.get(`studioService?name=${match.params.name}`).then(
        ({ data: studio }) => {
          if (Object.keys(studio).length !== 0) {
            // console.log("studio: ", studio);
            setDetails({
              shortName: studio.shortName,
              longName: studio.longName,
              currentPeriod: studio.current_period.price,
              previousPeriod: studio.previous_period.price,
              total: studio.total.price,
            });
          }
        }
      );
    };
    getDetails();
  }, []);

  // If the logged in studio tries to view a different one,
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
          header="Studio Summary"
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
                  <strong>Licensing Revenues:</strong>
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

export default StudioDetails;
