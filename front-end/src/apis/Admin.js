import API from "./BaseUrl";
/**
 * Route mappings for /displayAll routes
 */

export const ROUTE_MAPPING = {
  DemographicGroup: {
    displayAll: "/displayAllDemoGraphicGroup",
    create: "/demographicGroup",
  },
  Studio: { displayAll: "/displayAllStudio", create: "/studioService" },
  StreamingService: {
    displayAll: "/displayAllStreamingService",
    create: "/streamingService",
  },
};

Object.freeze(ROUTE_MAPPING);

/**
 * Create a new entity (demographic, studio, or stream)
 * @param {String} route
 * @param {Object} entityDetails
 */
export const createNewEntity = async (
  route,
  entityName,
  entityDetails,
  callback
) => {
  await API.post(route, entityDetails)
    .then((resp) => {
      if (resp.data === true) {
        callback(`New ${entityName} created!`);
      } else {
        callback(`${entityName} '${entityDetails.shortName}' already exists!`);
      }
    })
    .catch((err) => {
      console.log("error: ", err);
    });
};

/**
 * Display an entity group
 */
export const getAll = async (route) => {
  let response = await API.get(route).catch((error) => {
    console.log("error: ", error);
  });
  if (response !== undefined) {
    return response.data;
  }
  return [];
};

/**
 * Get the current time
 */
export const getCurrentTime = async () => {
  let response = await API.get("/displayTime").catch((error) => {
    console.log("error: ", error);
  });
  if (response !== undefined) {
    return response.data;
  }
  return "N/A";
};

/**
 * Advance to next month
 */
export const toNextTime = async () => {
  let response = await API.get("/nextTime").catch((error) => {
    console.log("error: ", error);
  });
  return response;
};

/**
 * Return a demographic group's details
 * @param {String} groupShortName
 */
export const getDemographicGroupDetails = async (groupShortName) => {
  let response = await API.get("/displayDemo?name=" + groupShortName).catch(
    (error) => {
      console.log("error: ", error);
    }
  );
  if (response !== undefined) {
    return response.data;
  }
  return {};
};
