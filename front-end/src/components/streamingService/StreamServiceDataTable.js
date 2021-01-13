import React, { useEffect, useState } from "react";
import DataTable from "../common/DataTable";
import DataRow from "../common/DataRow";
import { getAll, ROUTE_MAPPING } from "../../apis/Admin";

const StreamingServiceDataTable = ({ tableHeader }) => {
  const [streams, setStreams] = useState([]);
  useEffect(() => {
    getAll(ROUTE_MAPPING["StreamingService"]["displayAll"]).then(
      ({ streamingServices }) => {
        let temp = [];
        for (const serviceId in streamingServices) {
          temp.push(streamingServices[serviceId]);
        }
        setStreams(temp);
      }
    );
  }, []);

  const streamDataRows = streams.map((stream, idx) => {
    const selectableCol = stream.shortName;
    const link = `/streamingServices/${stream.shortName}`;
    const restOfCols = [
      stream.longName,
      `$${stream.monthlySubscriptionRate.price}`,
    ];
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
      headers={["Short Name/Username", "Long Name", "Subscription Price"]}
      dataRows={streamDataRows}
    />
  );
};

export default StreamingServiceDataTable;
