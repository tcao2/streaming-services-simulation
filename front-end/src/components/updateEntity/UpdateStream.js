import React, { useEffect, useState } from "react";
import { Button, Header, Grid, Segment, Form } from "semantic-ui-react";
import useInputState from "../../hooks/useInputState";
import useNumericState from "../../hooks/useNumericState";
import API from "../../apis/BaseUrl";
import FeedbackModal from "../common/FeedbackModal";

const UpdateStream = ({ shortName }) => {
  const [
    longName,
    setLongName,
    resetLongName,
    assignLongNameTo,
  ] = useInputState("");

  const [
    subPrice,
    setSubPrice,
    resetSubPrice,
    assignSubpriceTo,
  ] = useNumericState("");

  const [currentPeriodRevenue, setCurrentPeriodRevenue] = useState("");

  // Feedback modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("Default Modal Content");

  const showModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  useEffect(() => {
    const getStreamDetails = async () => {
      const resp = await API.get(`/streamingService?name=${shortName}`);
      if (resp.status === 200) {
        setCurrentPeriodRevenue(resp.data.current_period.price);
        assignLongNameTo(resp.data.longName);
        assignSubpriceTo(resp.data.monthlySubscriptionRate.price);
      }
    };
    getStreamDetails();
  }, []);

  const handleUpdate = async () => {
    const updatedDetails = {
      shortName: shortName,
      longName: longName,
      monthlySubscriptionRate: subPrice,
    };
    await API.post("/updateStreamingService", updatedDetails)
      .then((resp) => {
        showModal("Streaming Service updated!");
      })
      .catch((err) => {
        showModal("Streaming Service NOT updated! Check server!");
        console.log("error: ", err);
      });
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
              Update Streaming Service
            </Header>
            <Form>
              <Form.Field>
                <Form.Input
                  fluid
                  label="Short Name (uneditable)"
                  value={shortName}
                  readOnly
                />
              </Form.Field>
              <Form.Field>
                <Form.Input
                  fluid
                  label="Long Name"
                  value={longName}
                  onChange={setLongName}
                />
              </Form.Field>
              <Form.Field>
                <Form.Input
                  fluid
                  label="Subscription Price"
                  value={subPrice}
                  onChange={setSubPrice}
                  readOnly={currentPeriodRevenue === 0 ? false : true}
                />
              </Form.Field>
              <Button onClick={handleUpdate} color="teal" fluid size="large">
                Update
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default UpdateStream;
