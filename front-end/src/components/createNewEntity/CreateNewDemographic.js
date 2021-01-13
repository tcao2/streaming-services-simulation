import React, { useState } from "react";
import useInputState from "../../hooks/useInputState";
import useNumericState from "../../hooks/useNumericState";
import { createNewEntity, ROUTE_MAPPING } from "../../apis/Admin";
import { Form, Button, Message } from "semantic-ui-react";
import FeedbackModal from "../common/FeedbackModal";

const CreateNewDemographic = ({ clearFormErrors, isInt }) => {
  // Demographic group variables
  const [shortName, setShortName, resetShortName] = useInputState("", true);
  const [longName, setLongName, resetLongName] = useInputState("");
  const [accountSize, setAccountSize, resetAccountSize] = useNumericState("");
  const [emptyShortNameError, setEmptyShortNameError] = useState(false);
  const [emptyLongNameError, setEmptyLongNameError] = useState(false);
  const [emptyAccountError, setEmptyAccountError] = useState(false);
  const [formError, setFormError] = useState(false);
  const [formErrorMsg, setFormErrorMsg] = useState("");
  const [formLoader, setFormLoader] = useState(false);

  // Feedback modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("Default Modal Content");

  const showModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  /**
   * Handle demographic form submit
   */
  const handleFormSubmit = async () => {
    clearFormErrors([
      setEmptyShortNameError,
      setEmptyLongNameError,
      setEmptyAccountError,
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
    if (accountSize === "") {
      setEmptyAccountError(true);
      return;
    }
    if (!isInt(accountSize)) {
      setFormError(true);
      setFormErrorMsg("Number of accounts must be an integer!");
      return;
    }

    // If no issues with form fields, submit the request
    setFormLoader(true);
    await createNewEntity(
      ROUTE_MAPPING["DemographicGroup"]["create"],
      "Demographic Group",
      {
        shortName: shortName,
        longName: longName,
        initAccountSize: parseInt(accountSize),
      },
      showModal
    );
    resetShortName();
    resetLongName();
    resetAccountSize();
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
          <label>Number of Accounts</label>
          <Form.Input
            fluid
            placeholder="Number of accounts"
            type="text"
            value={accountSize}
            onChange={setAccountSize}
            error={
              emptyAccountError
                ? {
                    content: "Number of accounts required!",
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

export default CreateNewDemographic;
