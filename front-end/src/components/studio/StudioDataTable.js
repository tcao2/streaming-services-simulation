import React, { useEffect, useState } from "react";
import DataTable from "../common/DataTable";
import DataRow from "../common/DataRow";
import { getAll, ROUTE_MAPPING } from "../../apis/Admin";

const StudioDataTable = ({ tableHeader }) => {
  const [studios, setStudios] = useState([]);
  useEffect(() => {
    getAll(ROUTE_MAPPING["Studio"]["displayAll"]).then(({ studioServices }) => {
      let temp = [];
      // console.log("Fetched studios: ", { studioServices });
      for (const studioIdx in studioServices) {
        temp.push(studioServices[studioIdx]);
      }
      setStudios(temp);
    });
  }, []);

  const studioDataRows = studios.map((studio, idx) => {
    const selectableCol = studio.shortName;
    const link = `/studios/${studio.shortName}`;
    const restOfCols = [studio.longName];
    return (
      <DataRow
        key={idx}
        selectableCol={selectableCol}
        restOfCols={restOfCols}
        detailsLink={link}
      />
    );
  });

  return (
    <DataTable
      tableName={tableHeader}
      headers={["Short Name/Username", "Long Name"]}
      dataRows={studioDataRows}
    />
  );
};

export default StudioDataTable;
