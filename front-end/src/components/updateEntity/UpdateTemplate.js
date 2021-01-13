import React from "react";
import UpdateDemographic from "./UpdateDemographic";
import UpdateStream from "./UpdateStream";
import { useHistory } from "react-router-dom";
import auth from "../../auth";

const UpdateTempate = ({ match }) => {
  const history = useHistory();
  // setActiveItem("");
  const shortName = match.params.name;

  // If the logged in demographic group tries to change a different one,
  // redirect to unauthorized page
  if (shortName !== auth.getUsername()) {
    history.push("/unauthorized");
  }
  return (
    <>
      {match.params.entity === "demographic" ? (
        <UpdateDemographic shortName={shortName} />
      ) : (
        <UpdateStream shortName={shortName} />
      )}
    </>
  );
};

export default UpdateTempate;
