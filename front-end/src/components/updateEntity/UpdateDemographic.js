import React, { useEffect, useState } from "react";
import { Button, Header, Grid, Segment, Form } from "semantic-ui-react";
import useInputState from "../../hooks/useInputState";
import useNumericState from "../../hooks/useNumericState";
import API from "../../apis/BaseUrl";
import FeedbackModal from "../common/FeedbackModal";

const UpdateDemographic = ({ shortName }) => {
  const [
    longName,
    setLongName,
    resetLongName,
    assignLongNameTo,
  ] = useInputState("");
  const [
    accountSize,
    setAccountSize,
    resetAccountSize,
    assignAccountSizeTo,
  ] = useNumericState("");

  const [currentPeriodSpending, setCurrentPeriodSpending] = useState("");

  // Feedback modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("Default Modal Content");

  const showModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  useEffect(() => {
    const getGroupDetails = async () => {
      const resp = await API.get(`/displayDemo?name=${shortName}`);
      if (resp.status === 200) {
        setCurrentPeriodSpending(resp.data.current_month);
        assignLongNameTo(resp.data.longName);
        assignAccountSizeTo(resp.data.size);
      }
    };
    getGroupDetails();
  }, []);

  const handleUpdate = async () => {
    const updatedDetails = {
      shortName: shortName,
      longName: longName,
      initAccountSize: accountSize,
    };
    await API.post("/updatedemographicGroup", updatedDetails)
      .then((resp) => {
        showModal("Demographic group updated!");
      })
      .catch((err) => {
        showModal("Demographic group NOT updated! Check server!");
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
              Update Demographic Group
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
                  label="Number of Accounts"
                  value={accountSize}
                  onChange={setAccountSize}
                  readOnly={currentPeriodSpending === 0 ? false : true}
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

export default UpdateDemographic;
