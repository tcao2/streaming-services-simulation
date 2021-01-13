import React, { useEffect, useState } from "react";
import { ROUTE_MAPPING, getAll } from "../../apis/Admin";
import Offer from "../../components/offer/Offer";
import auth from "../../auth";
import API from "../../apis/BaseUrl";
import { Button, Header, Grid, Segment, Form } from "semantic-ui-react";
import useNumericState from "../../hooks/useNumericState";
import FeedbackModal from "../common/FeedbackModal";

const WatchEvent = () => {
  const [offers, setOffers] = useState([]);
  const [offerDetails, setOfferDetals] = useState({});
  const [formLoader, setFormLoader] = useState(false);
  const [watchPercent, setWatchPercent, resetWatchPercent] = useNumericState(
    ""
  );

  const [emptyOfferError, setEmptyOfferError] = useState(false);
  const [watchPercentError, setWatchPercentError] = useState(false);

  // Feedback modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("Default Modal Content");

  const showModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  useEffect(() => {
    // setActiveItem("");
    const getOffers = async () => {
      let tempOfferList = [];
      await getAll(ROUTE_MAPPING["StreamingService"]["displayAll"]).then(
        ({ streamingServices }) => {
          streamingServices.forEach((stream) => {
            if (stream.offersForCurrentPeriod !== null) {
              stream.offersForCurrentPeriod.forEach((offer) => {
                // console.log("offer: ", offer);
                let currOffer = new Offer(
                  stream.shortName,
                  stream.longName,
                  offer.shortName
                );
                currOffer.year = offer.year;
                if (offer.price !== undefined) {
                  currOffer.ppvPrice = "$" + offer.price.price;
                  currOffer.type = "PPV";
                } else {
                  currOffer.ppvPrice = "N/A";
                  currOffer.type = "Movie";
                }
                tempOfferList.push(currOffer);
              });
            }
          });
        }
      );
      //   console.log("offers: ", tempOfferList);
      setOffers(tempOfferList);
    };
    getOffers();
  }, []);

  /**
   * Returns the select options for events that can be watched
   */
  const availOffers = offers.map((offer) => {
    return {
      key: offer.name + offer.streamShortName,
      text:
        offer.name +
        " | " +
        offer.year +
        " | " +
        offer.type +
        " | " +
        offer.streamLongName,
      value: `{"name": "${offer.name}", "type": "${offer.type}", "year": "${offer.year}", "streamingService": "${offer.streamShortName}"}`,
    };
  });

  /**
   * Handle offer dropdown select change
   * @param {Object} data
   */
  const onEventSelectChange = (data) => {
    setEmptyOfferError(false);
    setWatchPercentError(false);
    const details = JSON.parse(data);
    setOfferDetals(details);
  };

  /**
   * Handle watch event submission
   */
  const watchEvent = async () => {
    setEmptyOfferError(false);
    setWatchPercentError(false);
    // If no event selected
    if (Object.keys(offerDetails).length === 0) {
      setEmptyOfferError(true);
      return;
    }

    // If there's an issue with the percentage
    if (watchPercent === "") {
      setWatchPercentError(true);
      return;
    }
    const percent = parseInt(watchPercent);
    if (percent < 1 || percent > 100) {
      setWatchPercentError(true);
      return;
    }

    const offer = {
      demographicGroup: auth.getUsername(),
      eventName: offerDetails.name,
      percentage: percent,
      streamingService: offerDetails.streamingService,
      yearProduced: offerDetails.year,
    };
    setFormLoader(true);
    await API.post("/watchEvent", offer)
      .then((resp) => {
        showModal(
          `${percent}% of this demographic group successfully watched the event '${offerDetails.name}'!`
        );
      })
      .catch((err) => {
        showModal("Event NOT watched! Check server!");
        console.log(err);
      });
    setFormLoader(false);
    resetWatchPercent();
    setOfferDetals({});
  };

  return (
    <>
      <FeedbackModal
        modalOpen={modalOpen}
        modalContent={modalContent}
        setModalOpen={setModalOpen}
      />
      <Grid centered columns={1}>
        <Grid.Column style={{ maxWidth: 600 }}>
          <Segment color="teal" stacked>
            <Header as="h2" color="teal" textAlign="center">
              Watch an Event
            </Header>
            <Form loading={formLoader}>
              <Form.Select
                fluid
                label="Available Offers"
                options={availOffers}
                placeholder="Select an Offer"
                onChange={(e, data) => onEventSelectChange(data.value)}
                error={
                  emptyOfferError
                    ? {
                        content: "Must select an offer!",
                        pointing: "above",
                      }
                    : null
                }
              />

              <Form.Input
                fluid
                label="Watch Percentage"
                placeholder="Percentage of group that will watch this event"
                value={watchPercent}
                onChange={setWatchPercent}
                error={
                  watchPercentError
                    ? {
                        content: "Required and must be between 1 and 100!",
                        pointing: "above",
                      }
                    : null
                }
              />

              <Button onClick={watchEvent} color="teal" fluid size="large">
                Submit
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default WatchEvent;
