import API from "./BaseUrl";

/**
 * Display all studio events
 */
export const getEvents = async (studioName) => {
    let response = await API.get().catch((error) => {
      console.log("error: ", error);
    });
    if (response !== undefined) {
      return response.data;
    }
    return [];
  };