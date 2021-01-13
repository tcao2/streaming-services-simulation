import React, { useEffect, useState } from "react";
import DataTable from "../common/DataTable";
import DataRow from "../common/DataRow";
import { getAll, ROUTE_MAPPING } from "../../apis/Admin";

const DemographicGroupDataTable = ({ tableHeader }) => {
  const [demographicGroups, setDemographicGroups] = useState([]);
  useEffect(() => {
    getAll(ROUTE_MAPPING["DemographicGroup"]["displayAll"]).then(
      (fetchedGroups) => {
        let temp = [];
        for (const group in fetchedGroups) {
          temp.push(fetchedGroups[group]);
        }
        setDemographicGroups(temp);
      }
    );
  }, []);

  const groupDataRows = demographicGroups.map((group, idx) => {
    const selectableCol = group.shortName;
    const link = `/demographicGroups/${group.shortName}`;
    // console.log("link is: ", link);
    const restOfCols = [group.longName, group.initAccountSize];
    return (
      <DataRow
        selectableCol={selectableCol}
        restOfCols={restOfCols}
        detailsLink={link}
        key={idx}
      />
    );
  });

  return (
    <DataTable
      tableName={tableHeader}
      headers={["Short Name/Username", "Long Name", "Number of Accounts"]}
      dataRows={groupDataRows}
    />
  );
};

export default DemographicGroupDataTable;
