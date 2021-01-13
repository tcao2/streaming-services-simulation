import React, { useState } from "react";
import useInputState from "../../hooks/useInputState";
import { createNewEntity, ROUTE_MAPPING } from "../../apis/Admin";
import { Form, Button, Message } from "semantic-ui-react";
import FeedbackModal from "../common/FeedbackModal";

const CreateNewStudio = ({ isInt, clearFormErrors }) => {
  const [formError, setFormError] = useState(false);
  const [formErrorMsg, setFormErrorMsg] = useState("");
  const [formLoader, setFormLoader] = useState(false);

  // Studio variables
  const [shortName, setShortName, resetShortName] = useInputState("", true);
  const [longName, setLongName, resetLongName] = useInputState("");
  const [emptyShortNameError, setEmptyShortNameError] = useState(false);
  const [emptyLongNameError, setEmptyLongNameError] = useState(false);

  // Feedback Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("Default Modal Content");

  const showModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  /**
   * Handle studio form submit
   */
  const handleFormSubmit = async () => {
    clearFormErrors([
      setEmptyShortNameError,
      setEmptyLongNameError,
      setFormError,
    ]);
    if (shortName === "") {
      setEmptyShortNameError(true);
      return;
    }
    if (longName === "") {
      setEmptyLongNameError(true);
      return;
    }
    setFormLoader(true);
    await createNewEntity(
      ROUTE_MAPPING["Studio"]["create"],
      "Studio",
      {
        shortName: shortName,
        longName: longName,
      },
      showModal
    );
    resetShortName();
    resetLongName();
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
        <Message error content={formErrorMsg} />
        <Button onClick={handleFormSubmit} color="teal" fluid size="large">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default CreateNewStudio;
