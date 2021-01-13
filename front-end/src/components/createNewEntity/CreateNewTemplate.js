import React, { useEffect, useState } from "react";
import { Segment, Container, Header } from "semantic-ui-react";
import CreateNewDemographic from "./CreateNewDemographic";
import CreateNewStream from "./CreateNewStream";
import CreateNewStudio from "./CreateNewStudio";
import CreateNewEvent from "./CreateNewEvent";

const CreateNewTemplate = ({ match, routeName }) => {
  const [formTitle, setFormTitle] = useState("");
  const [form, setForm] = useState("");
  useEffect(() => {
    // Don't set any active item header
    // setActiveItem("");
    if (Object.keys(match.params).length !== 0) {
      setFormBasedOnParams();
    } else {
      setFormBasedOnRouteName();
    }
  }, [match]);

  /**
   * If there's no params in the route
   */
  const setFormBasedOnRouteName = () => {
    setForm(routeName);
    switch (routeName) {
      case "event":
        setFormTitle("Event");
        break;
      default:
        break;
    }
  };

  /**
   * If we are accessing this Component from /create/:name
   */
  const setFormBasedOnParams = () => {
    setForm(match.params.name);
    switch (match.params.name) {
      case "stream":
        setFormTitle("Streaming Service");
        break;
      case "demographic":
        setFormTitle("Demographic Group");
        break;
      case "studio":
        setFormTitle("Studio");
        break;
      case "event":
        setFormTitle("Event");
        break;
      default:
        break;
    }
  };

  /**
   * check whether a string is an integer
   * @param {string} value
   */
  const isInt = (value) => {
    return (
      !isNaN(value) &&
      parseInt(Number(value)) == value &&
      !isNaN(parseInt(value, 10))
    );
  };

  /**
   * Clear form errors
   * @param {Array} clearErrorFunctions
   */
  const clearFormErrors = (clearErrorFunctions) => {
    clearErrorFunctions.forEach((clearErrorFunc) => {
      clearErrorFunc(false);
    });
  };

  /**
   * Render form's content based on the entity we are
   * creating
   * @param {String} entity 
   */
  const renderFormContent = (entity) => {
    switch (entity) {
      case "stream":
        return (
          <CreateNewStream isInt={isInt} clearFormErrors={clearFormErrors} />
        );
      case "demographic":
        return (
          <CreateNewDemographic
            isInt={isInt}
            clearFormErrors={clearFormErrors}
          />
        );
      case "studio":
        return (
          <CreateNewStudio isInt={isInt} clearFormErrors={clearFormErrors} />
        );
      case "event":
        return (
          <CreateNewEvent isInt={isInt} clearFormErrors={clearFormErrors} />
        );
      default:
        break;
    }
  };
  return (
    <Container text>
      <Segment>
        <Header as="h2" color="teal" textAlign="center">
          New {formTitle}
        </Header>
        {renderFormContent(form)}
      </Segment>
    </Container>
  );
};

export default CreateNewTemplate;
