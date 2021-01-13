import API from "./BaseUrl";

export const offerEvent = async (eventDetails, eventType) => {
  let postUrl = "";
  switch (eventType.toLowerCase()) {
    case "movie":
      postUrl = "/offerMovie";
      break;
    case "ppv":
      postUrl = "/offerPPV";
      break;
    default:
      postUrl = "/offerMovie";
      break;
  }
  await API.post(postUrl, eventDetails)
    .then((response) => {
      alert("Event offered!");
    })
    .catch((error) => {
      alert("Error! Check backend server!");
      console.log("Error: ", error);
    });
};
