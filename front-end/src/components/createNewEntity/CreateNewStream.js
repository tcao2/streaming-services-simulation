import React, { useState } from "react";
import useInputState from "../../hooks/useInputState";
import useNumericState from "../../hooks/useNumericState";
import { createNewEntity, ROUTE_MAPPING } from "../../apis/Admin";
import { Form, Button, Message } from "semantic-ui-react";
import FeedbackModal from "../common/FeedbackModal";

const CreateNewStream = ({ isInt, clearFormErrors }) => {
  const [formError, setFormError] = useState(false);
  const [formErrorMsg, setFormErrorMsg] = useState("");
  const [formLoader, setFormLoader] = useState(false);

  // Streaming service variables
  const [shortName, setShortName, resetStreamShortName] = useInputState(
    "",
    true
  );
  const [longName, setLongName, resetStreamgLongName] = useInputState("");
  const [subPrice, setSubPrice, resetSubPrice] = useNumericState("");
  const [emptySubPriceError, setEmptySubPriceError] = useState(false);
  const [emptyShortNameError, setEmptyStreamShortNameError] = useState(false);
  const [emptyLongNameError, setEmptyStreamLongNameError] = useState(false);

  // Feedback modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("Default Modal Content");

  const showModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  /**
   * Handle streaming service form submit
   */
  const handleFormSubmit = async () => {
    clearFormErrors([
      setEmptyStreamShortNameError,
      setEmptyStreamLongNameError,
      setFormError,
    ]);
    if (shortName === "") {
      setEmptyStreamShortNameError(true);
      return;
    }
    if (longName === "") {
      setEmptyStreamLongNameError(true);
      return;
    }
    if (subPrice === "") {
      setEmptySubPriceError(true);
      return;
    }
    if (!isInt(subPrice)) {
      console.log("sub price error!");
      setFormError(true);
      setFormErrorMsg("Subscription price can only have digits!");
      return;
    }
    setFormLoader(true);
    await createNewEntity(
      ROUTE_MAPPING["StreamingService"]["create"],
      "Streaming Service",
      {
        shortName: shortName,
        longName: longName,
        monthlySubscriptionRate: subPrice,
      },
      showModal
    );
    resetStreamShortName();
    resetStreamgLongName();
    resetSubPrice();
    setFormLoader(false);
  };

  return (
    <>
      <FeedbackModal
        modalOpen={modalOpen}
        modalContent={modalContent}
        setModalOpen={setModalOpen}
      />
      <Form loading={formLoader} error={formError}>
        <Form.Field>
          <label>Short Name</label>
          <Form.Input
            fluid
            placeholder="Short name"
            type="text"
            value={shortName}
            onChange={setShortName}
            error={
              emptyShortNameError
                ? {
                    content: "Short name required!",
                    pointing: "above",
                  }
                : null
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Long Name</label>
          <Form.Input
            fluid
            placeholder="Long name"
            type="text"
            value={longName}
            onChange={setLongName}
            error={
              emptyLongNameError
                ? {
                    content: "Long name required!",
                    pointing: "above",
                  }
                : null
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Subscription Price</label>
          <Form.Input
            fluid
            placeholder="Subscription price"
            type="text"
            value={subPrice}
            onChange={setSubPrice}
            error={
              emptySubPriceError
                ? {
                    content: "Subscription price required!",
                    pointing: "above",
                  }
                : null
            }
          />
        </Form.Field>
        <Message error content={formErrorMsg} />
        <Button onClick={handleFormSubmit} color="teal" fluid size="large">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default CreateNewStream;
