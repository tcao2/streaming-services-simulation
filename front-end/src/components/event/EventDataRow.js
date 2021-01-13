import React, { useState } from "react";
import { Button, Table, Modal, Form, Message } from "semantic-ui-react";
import auth from "../../auth";
import { updateEvent } from "../../apis/Studio";
import useNumericState from "../../hooks/useNumericState";
import FeedbackModal from "../common/FeedbackModal";

const EventDataRow = ({
  event,
  setEvents,
  getEvents,
  filterEventsForStudio,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false); // Modal for editing an event
  const [
    duration,
    setDuration,
    resetDuration,
  ] = useNumericState("");
  const [
    licensePrice,
    setLicensePrice,
    resetLicensePrice,
  ] = useNumericState("");

  const [formError, setFormError] = useState(false);
  const [formErrorMsg, setFormErrorMsg] = useState("");

  // Feedback modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("Default Modal Content");

  const showModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  /**
   * Update an event
   */
  const handleEventUpdate = async () => {
    setFormError(false);
    setFormErrorMsg("");

    if (duration === "") {
      setFormErrorMsg("Duration required!");
      setFormError(true);
      return;
    }

    if (licensePrice === "") {
      setFormErrorMsg("License Price required!");
      setFormError(true);
      return;
    }

    const newEventDetails = {
      studioName: event.studioShortName,
      event: {
        shortName: event.shortName,
        longName: event.longName,
        duration: parseInt(duration),
        year: event.year,
        licensePrice: licensePrice,
      },
    };

    // Update the selected event
    await updateEvent(newEventDetails, event.type, showModal);

    // Update modal's values
    resetDuration();
    resetLicensePrice();

    // Refresh the table to reflect the new changes
    let updatedEvents = await getEvents();
    updatedEvents = filterEventsForStudio(updatedEvents);
    setEditModalOpen(false);
    setTimeout(() => {
      setEvents(updatedEvents);
    }, 500);
  };

  return (
    <>
      <FeedbackModal
        modalOpen={modalOpen}
        modalContent={modalContent}
        setModalOpen={setModalOpen}
      />
      {/* Modal to display form to edit an event */}
      <Modal
        onClose={() => setEditModalOpen(false)}
        onOpen={() => setEditModalOpen(true)}
        open={editModalOpen}
      >
        <Modal.Header>Edit Event</Modal.Header>
        <Modal.Content>
          <Form error={formError}>
            <Form.Field>
              <Form.Input
                fluid
                label="Event Name"
                value={event.longName}
                readOnly
              />
            </Form.Field>
            <Form.Field>
              <Form.Input fluid label="Year" value={event.year} readOnly />
            </Form.Field>
            <Form.Field>
              <Form.Input
                fluid
                label="Duration"
                placeholder="Duration in mins"
                value={duration}
                onChange={setDuration}
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                fluid
                label="License Price"
                placeholder="License price"
                value={licensePrice}
                onChange={setLicensePrice}
              />
            </Form.Field>
            <Message error content={formErrorMsg} />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button positive onClick={handleEventUpdate}>
            Submit
          </Button>
        </Modal.Actions>
      </Modal>

      <Table.Row>
        {auth.getRole() === "studio" && (
          <Table.Cell>
            <Button
              color="teal"
              icon="edit"
              labelPosition="left"
              content="Edit"
              onClick={() => setEditModalOpen(true)}
            />
          </Table.Cell>
        )}

        <Table.Cell>{event.longName}</Table.Cell>
        <Table.Cell>{event.type}</Table.Cell>
        <Table.Cell>{event.year}</Table.Cell>
        <Table.Cell>{event.duration} mins</Table.Cell>
        <Table.Cell>{event.studioLongName}</Table.Cell>
        <Table.Cell>${event.licensePrice}</Table.Cell>
      </Table.Row>
    </>
  );
};

export default EventDataRow;
