import React from "react";
import { Button, Modal } from "semantic-ui-react";

const FeedbackModal = ({ modalOpen, modalContent, setModalOpen }) => {
  return (
    <Modal
      centered={false}
      size="tiny"
      dimmer="blurring"
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      onOpen={() => setModalOpen(true)}
    >
      <Modal.Content>
        <Modal.Description>{modalContent}</Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setModalOpen(false)}>OK</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FeedbackModal;
