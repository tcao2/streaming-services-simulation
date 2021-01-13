import React from "react";
import { Table } from "semantic-ui-react";

const OfferDataRow = ({ stream, type, shortName, yearProduced, ppvPrice }) => {
  return (
    <Table.Row>
      <Table.Cell>{stream}</Table.Cell>
      <Table.Cell>{type}</Table.Cell>
      <Table.Cell>{shortName}</Table.Cell>
      <Table.Cell>{yearProduced}</Table.Cell>
      <Table.Cell>{ppvPrice}</Table.Cell>
    </Table.Row>
  );
};

export default OfferDataRow;
