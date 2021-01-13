import React from "react";
import { Table, Header } from "semantic-ui-react";
/**
 * List of entity
 */
const DataTable = ({ tableName, headers, dataRows }) => {
  const headerRows = headers.map((headerName, idx) => {
    return (
      <Table.HeaderCell key={headerName + idx}>{headerName}</Table.HeaderCell>
    );
  });

  return (
    <>
      <Header as="h2">{tableName}</Header>
      <Table color="teal" celled selectable>
        <Table.Header>
          <Table.Row>{headerRows}</Table.Row>
        </Table.Header>

        <Table.Body>{dataRows}</Table.Body>
      </Table>
    </>
  );
};

export default DataTable;
