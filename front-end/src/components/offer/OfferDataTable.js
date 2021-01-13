import React, { useEffect, useState } from "react";
import DataTable from "../common/DataTable";
import { ROUTE_MAPPING, getAll } from "../../apis/Admin";
import Offer from "../../components/offer/Offer";
import auth from "../../auth";
import { Button, Table, Modal } from "semantic-ui-react";
import API from "../../apis/BaseUrl";
import FeedbackModal from "../common/FeedbackModal";

const OfferDataTable = ({ tableHeader }) => {
  const [offers, setOffers] = useState([]);
  const [count, setCount] = useState(0); // Increment everytime an event is retracted to trigger a re-render
  const [modalOpen, setModalOpen] = useState(false);
  const [offerToRetract, setOfferToRetract] = useState({});

  // Feedback modal
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackModalContent, setFeedbackModalContent] = useState(
    "Default Modal Content"
  );

  const showFeedbackModal = (content) => {
    setFeedbackModalContent(content);
    setFeedbackModalOpen(true);
  };

  useEffect(() => {
    const getOffers = async () => {
      let offers = [];
      await getAll(ROUTE_MAPPING["StreamingService"]["displayAll"]).then(
        ({ streamingServices }) => {
          streamingServices.forEach((stream) => {
            if (stream.offersForCurrentPeriod !== null) {
              stream.offersForCurrentPeriod.forEach((offer) => {
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
                offers.push(currOffer);
              });
            }
          });
        }
      );
      setOffers(offers);
    };
    getOffers();

    // Need to call it in a useEffect() call to
    // get rid of the warning. Reference:
    // https://stackoverflow.com/questions/62336340/cannot-update-a-component-while-rendering-a-different-component-warning
    // setActiveItem("Offers");
  }, [count]);

  /**
   * Make an API call to retract the offer
   */
  const retractOffer = async () => {
    await API.post("/retractMovie", offerToRetract)
      .then((resp) => {
        if (resp.data === true) {
          showFeedbackModal("Event retracted!");
        } else {
          showFeedbackModal(
            "Event could not be retracted as it was already watched!"
          );
        }
        setModalOpen(false);
        setCount(count + 1);
      })
      .catch((err) => {
        showFeedbackModal("Offer NOT retracted! Check server");
        console.log("Err: ", err);
      });
  };

  /**
   * Show confirmation modal when on Retract btn click
   * @param {Object} offerDetails
   */
  const handleRetractBtnClick = (offerDetails) => {
    // console.log("retract details: ", offerDetails);
    setOfferToRetract(offerDetails);
    setModalOpen(true);
  };

  /**
   * If we are showing this page to a streaming service,
   * only show offers of that streaming service. If we are showing
   * to an admin or a demographic group, show all offers
   */
  const filteredOffers =
    auth.getRole() === "admin" || auth.getRole() === "demo"
      ? offers
      : offers.filter((offer) => offer.streamShortName === auth.getUsername());

  /**
   * Construct the offer data rows
   */
  const offerDataRows = filteredOffers.map((offer) => {
    // console.log("offer row data: ", offer);
    return (
      <Table.Row>
        {/* Only streaming service can see the Retract button */}
        {auth.getRole() === "stream" && (
          <Table.Cell>
            <Button
              color="teal"
              onClick={() =>
                handleRetractBtnClick({
                  movie: offer.name,
                  streamingService: offer.streamShortName,
                  year: offer.year,
                })
              }
              icon="undo alternate"
              labelPosition="left"
              content="Retract"
            />
          </Table.Cell>
        )}

        <Table.Cell>{offer.streamLongName}</Table.Cell>
        <Table.Cell>{offer.name}</Table.Cell>
        <Table.Cell>{offer.year}</Table.Cell>
        <Table.Cell>{offer.type}</Table.Cell>
        <Table.Cell>{offer.ppvPrice}</Table.Cell>
      </Table.Row>
    );
  });

  return (
    <>
      <FeedbackModal
        modalOpen={feedbackModalOpen}
        modalContent={feedbackModalContent}
        setModalOpen={setFeedbackModalOpen}
      />
      <Modal size="tiny" open={modalOpen}>
        <Modal.Header>Retract Offer</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to retract this offer?</p>
          <div>
            <strong>Name: </strong> {offerToRetract.movie} <br />
            <strong>Year: </strong> {offerToRetract.year} <br />
            <strong>Stream: </strong> {offerToRetract.streamingService} <br />
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setModalOpen(false)}>
            No
          </Button>
          <Button positive onClick={retractOffer}>
            Yes
          </Button>
        </Modal.Actions>
      </Modal>
      <DataTable
        tableName={tableHeader}
        headers={
          auth.getRole() === "stream"
            ? [
                "Action",
                "Streaming Service",
                "Offer Name",
                "Year",
                "Type",
                "PPV Price",
              ]
            : ["Streaming Service", "Offer Name", "Year", "Type", "PPV Price"]
        }
        dataRows={offerDataRows}
      />
    </>
  );
};

export default OfferDataTable;
