import API from "./BaseUrl";

/**
 * Create a new event
 * @param {Object} eventDetails
 * @param {String} eventType
 */
export const createEvent = async (eventDetails, eventType, callback) => {
  await API.post(`/studio/event/${eventType}`, eventDetails)
    .then((resp) => {
      if (resp.data === true) {
        callback("New event created!");
      } else {
        callback("Event already exists!");
      }
    })
    .catch((err) => {
      callback("Error! Check server!");
      console.log("Error: ", err);
    });
};

/**
 * Update an event
 * @param {Object} eventDetails
 * @param {String} eventType
 */
export const updateEvent = async (eventDetails, eventType, callback) => {
  await API.post(`/studio/event/${eventType}/update`, eventDetails)
    .then((resp) => {
      if (resp.data === true) {
        callback("Event updated!");
      } else {
        callback(
          "Event was NOT updated! License price can only be updated if no one has watched this event!"
        );
      }
    })
    .catch((error) => {
      callback("Error! Event NOT updated! Check server!");
      console.log("Error: ", error);
    });
};
