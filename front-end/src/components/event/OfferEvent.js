import React, { useState, useEffect } from "react";
import auth from "../../auth";
import { Button, Header, Grid, Segment, Form } from "semantic-ui-react";
import { ROUTE_MAPPING, getAll } from "../../apis/Admin";
import API from "../../apis/BaseUrl";
import Event from "./Event";
import useNumericState from "../../hooks/useNumericState";
import FeedbackModal from "../common/FeedbackModal";

const OfferEvent = () => {
  const [studioEvents, setStudioEvents] = useState([]); // List of events that can be offered
  const [offeredEvents, setOfferedEvents] = useState({}); // List of events that the studio already offered
  const [
    ppvPrice,
    setPpvPrice,
    resetPpvPrice,
    assignPpvPriceTo,
  ] = useNumericState("0");
  const [priceDisabled, setPriceDisabled] = useState(true);
  const [eventDetails, setEventDetails] = useState({});
  const [formLoader, setFormLoader] = useState(false);
  const [priceErr, setPriceErr] = useState(false);
  const [emptyEventErr, setEmptyEventErr] = useState(false);

  // Feedback modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("Default Modal Content");

  const showModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  /**
   * Get events that the stream already offer for the current period
   */
  const getCurrentPeriodOffers = async () => {
    const streamName = auth.getUsername();
    const alreadyOffered = {};
    await API.get(`/streamingService?name=${streamName}`).then(({ data }) => {
      //   console.log("data: ", data);

      if (data.offersForCurrentPeriod != null) {
        data.offersForCurrentPeriod.forEach((offer) => {
          alreadyOffered[[offer.shortName, offer.year]] = true;
        });
      }

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

  useEffect(() => {
    // setActiveItem("");
    getCurrentPeriodOffers();
    getEvents();
  }, []);

  /**
   * Handle event dropdown change
   * @param {Object} data
   */
  const onEventSelectChange = (data) => {
    setPriceErr(false);
    setEmptyEventErr(false);
    const details = JSON.parse(data);
    setEventDetails(details);
    if (details.type === "ppv") {
      setPriceDisabled(false);
    } else {
      setPriceDisabled(true);
    }
  };

  /**
   * Handle license event submit
   */
  const licenseEvent = async () => {
    setPriceErr(false);
    setEmptyEventErr(false);
    // If no event selected
    if (Object.keys(eventDetails).length === 0) {
      setEmptyEventErr(true);
      return;
    }
    // If the selected event is PPV and price is 0 or empty
    if (eventDetails.type === "ppv" && (ppvPrice === "0" || ppvPrice === "")) {
      setPriceErr(true);
      return;
    }

    let offer = {
      streamingService: auth.getUsername(),
      studio: eventDetails.studio,
      year: eventDetails.year,
    };
    let postURL = "";
    if (eventDetails.type === "ppv") {
      postURL = "/offerPPV";
      offer.ppv = eventDetails.name;
      offer.price = ppvPrice;
    } else {
      postURL = "/offerMovie";
      offer.movie = eventDetails.name;
    }

    // console.log("final offer details: ", offer);

    setFormLoader(true);
    await API.post(postURL, offer)
      .then((resp) => {
        showModal("Event licensed!");
        // alert("Event licensed!");
      })
      .catch((err) => {
        showModal("Event NOT licensed! Check server");
        console.log("err: ", err);
      });
    await getCurrentPeriodOffers();
    await getEvents();
    assignPpvPriceTo("0");
    setPriceDisabled(true);
    setFormLoader(false);
    setEventDetails({}); // Clear event object. This is important!
  };

  const filteredEvents = studioEvents.filter(
    (event) => !([event.shortName, event.year] in offeredEvents)
  );

  const availableEvents = filteredEvents.map((event) => ({
    key: event.longName,
    text:
      event.longName +
      " | " +
      event.year +
      " | " +
      event.type +
      " | " +
      event.studioLongName +
      " | $" +
      event.licensePrice,
    value: `{"name": "${event.shortName}", "type": "${event.type}", "year": "${
      event.year
    }", "streamingService": "${auth.getUsername()}", "studio": "${
      event.studioShortName
    }"}`,
  }));

  /**
   * Form to offer an event if there are still events available to license
   */
  const eventSelectionForm = (
    <Segment color="teal" stacked>
      <Header as="h2" color="teal" textAlign="center">
        License an Event
      </Header>
      <Form loading={formLoader}>
        <Form.Input
          fluid
          label="Streaming Service"
          value={auth.getUsername()}
          readOnly
        />

        <Form.Select
          fluid
          label="Available Events"
          options={availableEvents}
          placeholder="Select an event"
          onChange={(e, data) => onEventSelectChange(data.value)}
          error={
            emptyEventErr
              ? {
                  content: "Must select an event!",
                  pointing: "above",
                }
              : null
          }
        />

        <Form.Input
          fluid
          label="PPV Price (if applicable)"
          value={ppvPrice}
          onChange={setPpvPrice}
          disabled={priceDisabled}
          error={
            priceErr
              ? {
                  content: "PPV: price required and cannot be 0",
                  pointing: "above",
                }
              : null
          }
        />

        <Button onClick={licenseEvent} color="teal" fluid size="large">
          Submit
        </Button>
      </Form>
    </Segment>
  );

  const noEventLeft = <Segment>No event left to license.</Segment>;

  return (
    <>
      <FeedbackModal
        modalOpen={modalOpen}
        modalContent={modalContent}
        setModalOpen={setModalOpen}
      />
      <Grid centered columns={1}>
        <Grid.Column style={{ maxWidth: 600 }}>
          {availableEvents.length !== 0 ? eventSelectionForm : noEventLeft}
        </Grid.Column>
      </Grid>
    </>
  );
};

export default OfferEvent;
