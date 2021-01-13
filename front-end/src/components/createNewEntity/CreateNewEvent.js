import React, { useEffect, useState } from "react";
import useInputState from "../../hooks/useInputState";
import useNumericState from "../../hooks/useNumericState";
import { createEvent } from "../../apis/Studio";
import { Form, Button, Message, Select } from "semantic-ui-react";
import FeedbackModal from "../common/FeedbackModal";
import auth from "../../auth";

const CreateNewEvent = ({ clearFormErrors }) => {
  const [studioName, setStudioName] = useState("");
  const [eventType, setEventType] = useState("");
  const [shortName, setShortName, resetShortName] = useInputState("");
  const [name, setName, resetName] = useInputState("");
  const [duration, setDuration, resetDuration] = useNumericState("");
  const [year, setYear, resetYear] = useNumericState("");
  const [licensePrice, setLicensePrice, resetLicensePrice] = useNumericState(
    ""
  );

  const [nameError, setNameError] = useState(false);
  const [eventTypeError, setEventTypeError] = useState(false);
  const [durationError, setDurationError] = useState(false);
  const [yearError, setYearError] = useState(false);
  const [licensePriceError, setLicensePriceError] = useState(false);
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

  const eventTypeOptions = [
    { key: "movie", text: "Movie", value: "movie" },
    { key: "ppv", text: "PPV", value: "ppv" },
  ];

  useEffect(() => {
    setStudioName(auth.getUsername());
  }, []);

  const handleFormSubmit = async () => {
    clearFormErrors([
      setNameError,
      setDurationError,
      setYearError,
      setLicensePriceError,
      setFormError,
    ]);
    if (name === "") {
      setNameError(true);
      return;
    }
    if (eventType === "") {
      setEventTypeError(true);
      return;
    }
    if (duration === "") {
      setDurationError(true);
      return;
    }
    if (year === "") {
      setYearError(true);
      return;
    }
    if (licensePrice === "") {
      setLicensePriceError(true);
      return;
    }

    if (parseInt(year) > 2021 || parseInt(year) < 1800) {
      setFormErrorMsg("Year must be between 1800 and 2021!");
      setFormError(true);
      return;
    }

    // If no error with the form's fields
    setFormLoader(true);
    const newEvent = {
      studioName: studioName,
      event: {
        shortName: name, // We only need to enter the event's name --> shortName == longName == name
        longName: name,
        duration: parseInt(duration),
        year: year,
        licensePrice: licensePrice,
      },
    };
    await createEvent(newEvent, eventType, showModal);
    resetShortName();
    resetName();
    resetYear();
    resetDuration();
    resetLicensePrice();
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
          <label>Studio</label>
          <Form.Input fluid value={studioName} readOnly />
        </Form.Field>
        <Form.Field
          control={Select}
          label="Event Type"
          options={eventTypeOptions}
          onChange={(e, data) => setEventType(data.value)}
          placeholder="Movie or PPV"
          error={
            eventTypeError
              ? {
                  content: "Type required!",
                  pointing: "above",
                }
              : null
          }
        />
        <Form.Field>
          <label>Name</label>
          <Form.Input
            fluid
            placeholder="Name"
            type="text"
            value={name}
            onChange={setName}
            error={
              nameError
                ? {
                    content: "Name required!",
                    pointing: "above",
                  }
                : null
            }
          />
        </Form.Field>

        <Form.Field>
          <label>Duration</label>
          <Form.Input
            fluid
            placeholder="Duration in mins"
            type="text"
            value={duration}
            onChange={setDuration}
            error={
              durationError
                ? {
                    content: "Duration required!",
                    pointing: "above",
                  }
                : null
            }
          />
        </Form.Field>

        <Form.Field>
          <label>Year</label>
          <Form.Input
            fluid
            placeholder="Year produced"
            type="text"
            value={year}
            onChange={setYear}
            error={
              yearError
                ? {
                    content: "Year produced required!",
                    pointing: "above",
                  }
                : null
            }
          />
        </Form.Field>

        <Form.Field>
          <label>License Price</label>
          <Form.Input
            fluid
            placeholder="License Price"
            type="text"
            value={licensePrice}
            onChange={setLicensePrice}
            error={
              licensePriceError
                ? {
                    content: "License price required!",
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

export default CreateNewEvent;
