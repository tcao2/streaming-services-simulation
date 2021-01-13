import React, { useState, useEffect } from "react";
import DataTable from "../common/DataTable";
import EventDataRow from "../event/EventDataRow";
import Event from "./Event";
import { ROUTE_MAPPING, getAll } from "../../apis/Admin";
import auth from "../../auth";

const EventDataTable = ({ tableHeader: tableName }) => {
  // Need to wrap it in a useEffect() call to
  // get rid of the warning. Reference:
  // https://stackoverflow.com/questions/62336340/cannot-update-a-component-while-rendering-a-different-component-warning
  const [studioEvents, setStudioEvents] = useState([]);

  /**
   * Retrieve events from all studios
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
    return fetchedEvents;
  };

  useEffect(() => {
    // setActiveItem("Events");
    const retrieveEvents = async () => {
      let events = await getEvents();
      events = filterEventsForStudio(events);
      setStudioEvents(events);
    };
    retrieveEvents();
  }, []);

  /**
   * Filter events so the studio can only see events
   * that it creates
   */
  const filterEventsForStudio = (eventList) => {
    if (auth.getRole() === "studio") {
      const studioName = auth.getUsername();
      const filteredEvents = eventList.filter(
        (event) => event.studioShortName === studioName
      );
      return filteredEvents;
    }
    // If the logged in user isn't a studio,
    // display all events from all studios
    return eventList;
  };

  /**
   * Table's rows
   */
  const eventDataRows = studioEvents.map((event, idx) => {
    return (
      <EventDataRow
        setEvents={setStudioEvents}
        getEvents={getEvents}
        filterEventsForStudio={filterEventsForStudio}
        key={idx}
        event={event}
      />
    );
  });

  const addBtnStyle = {
    marginBottom: "10px",
  };

  const otherEntityHeaders = [
    "Name",
    "Type",
    "Year",
    "Duration",
    "Studio",
    "License Fee",
  ];
  const studioHeaders = [
    "Action",
    "Name",
    "Type",
    "Year",
    "Duration",
    "Studio",
    "License Fee",
  ];

  return (
    <DataTable
      tableName={tableName}
      headers={auth.getRole() === "studio" ? studioHeaders : otherEntityHeaders}
      dataRows={eventDataRows}
    />
  );
};

export default EventDataTable;
