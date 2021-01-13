import React from "react";
import { Table } from "semantic-ui-react";
import { Link} from "react-router-dom";

const DataRow = ({ detailsLink, selectableCol, restOfCols }) => {
  return (
    <Table.Row>
      <Table.Cell>
        <Link to={detailsLink}>{selectableCol}</Link>
      </Table.Cell>
      {restOfCols.map((colVal) => {
        return <Table.Cell>{colVal}</Table.Cell>;
      })}
    </Table.Row>
  );
};

export default DataRow;
