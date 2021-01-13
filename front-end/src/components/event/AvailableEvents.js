import React, { useEffect, useState, useReducer } from "react";
import { Button, Table, Modal } from "semantic-ui-react";
import DataTable from "../common/DataTable";
import { ROUTE_MAPPING, getAll } from "../../apis/Admin";
import API from "../../apis/BaseUrl";
import auth from "../../auth";
import Event from "./Event";

const modalReducer = (state, action) => {
  switch (action.type) {
    case "close":
      return { open: false };
    case "open":
      const event = action.eventDetails;
      return {
        open: true,
        eventDetails: (
          <div>
            <strong>Name:</strong> {event.eventName} <br />
            <strong>Type:</strong> {event.eventType} <br />
            <strong>Year:</strong> {event.year} <br />
            <strong>Studio:</strong> {event.studioLongName}
          </div>
        ),
      };
    case "license":
      const testing = async () => {
        await licenseEvent();
      };
      testing();
      return { open: false };
    default:
      throw new Error("Unsupported action...");
  }
};

const licenseEvent = async () => {
  await API.get("/displayTime").then((resp) => {
    alert("time: ", resp);
  });
};

const AvailableEvents = ({ setActiveItem, tableHeader }) => {
  const [state, dispatch] = useReducer(modalReducer, {
    open: false,
    eventDetails: undefined,
  });
  const { open, eventDetails } = state;
//   const [open, setOpen] = useState(false);

  const licenseAction = () => {
    // setOpen(false);
  };

  const [studioEvents, setStudioEvents] = useState([]); // List of events that can be offered
  const [offeredEvents, setOfferedEvents] = useState({}); // List of events that the studio already offered

  useEffect(() => {
    /**
     * Get events that the stream already offer for the current period
     */
    const getCurrentPeriodOffers = async () => {
      const streamName = auth.getUsername();
      const alreadyOffered = {};
      await API.get(`/streamingService?name=${streamName}`).then(({ data }) => {
        data.offersForCurrentPeriod.forEach((offer) => {
          alreadyOffered[[offer.shortName, offer.year]] = true;
        });
        setOfferedEvents(alreadyOffered);
      });
    };

    /**
     * Get events that the stream can offer
     */
    const getEvents = async () => {
      let fetchedEvents = [];
      await getAll(ROUTE_MAPPING["Studio"]["displayAll"]).then(
        ({ studioServices }) => {
          for (const studioIdx in studioServices) {
            const currStudio = studioServices[studioIdx];
            const events = currStudio.studioEventList;
            for (const eventIdx in events) {
              const currEvent = events[eventIdx];
              fetchedEvents.push(
                new Event(
                  currStudio.shortName,
                  currStudio.longName,
                  currEvent.shortName,
                  currEvent.longName,
                  currEvent.year,
                  currEvent.duration,
                  currEvent.licensePrice.price,
                  currEvent.type
                )
              );
            }
          }
        }
      );
      setStudioEvents(fetchedEvents);
    };
    getCurrentPeriodOffers();
    getEvents();
  }, []);
  const filteredEvents = studioEvents.filter(
    (event) => !([event.shortName, event.year] in offeredEvents)
  );
  const availableEventDataRows = filteredEvents.map((event, idx) => {
    let eventDetails = {
      eventName: event.longName,
      eventType: event.type,
      year: event.year,
      streamingService: auth.getUsername(),
      studioShortName: event.studioShortName,
      studioLongName: event.studioLongName,
    };
    return (
      <>
        <Table.Row>
          <Table.Cell>
            <Button
              onClick={() =>
                dispatch({
                  type: "open",
                  eventDetails: eventDetails,
                  eventName: event.longName,
                })
              }
            >
              License this event
            </Button>
          </Table.Cell>
          <Table.Cell>{event.longName}</Table.Cell>
          <Table.Cell>{event.type}</Table.Cell>
          <Table.Cell>{event.year}</Table.Cell>
          <Table.Cell>{event.duration} mins</Table.Cell>
          <Table.Cell>{event.studioLongName}</Table.Cell>
          <Table.Cell>${event.licensePrice}</Table.Cell>
        </Table.Row>
      </>
    );
  });

  return (
    <>
      <Modal
        size="small"
        open={open}
        onClose={() => dispatch({ type: "close" })}
      >
        <Modal.Header>License event</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to license the event below?</p>
          {eventDetails}
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => dispatch({ type: "close" })}>
            No
          </Button>
          {/* <Button positive onClick={() => dispatch({ type: "license" })}>
            Yes
          </Button> */}
          <Button positive onClick={licenseAction}>
            Yes
          </Button>
        </Modal.Actions>
      </Modal>

      <DataTable
        tableName={tableHeader}
        headers={[
          "Action",
          "Name",
          "Type",
          "Year",
          "Duration",
          "Studio",
          "License Fee",
        ]}
        dataRows={availableEventDataRows}
      />
    </>
  );
};

export default AvailableEvents;
