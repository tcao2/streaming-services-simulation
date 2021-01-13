// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   Segment,
//   Button,
//   Container,
//   Header,
//   Message,
// } from "semantic-ui-react";
// import {
//   createDemographicGroup,
//   createStream,
//   createStudio,
// } from "../../apis/Admin";
// import useInputState from "../../hooks/useInputState";

// /**
//  * ! OLD CODE. ONLY KEEP FOR REFERENCES
//  * @param {*} param0 
//  */
// const CreateNew = ({ match, setActiveItem }) => {
//   // Which entity to create: demographic group, studio, or streaming service
//   const [formContent, setFormContent] = useState(null);
//   const [formTitle, setFormTitle] = useState("");

//   // Common form variables
//   const [formError, setFormError] = useState(false);
//   const [formErrorMsg, setFormErrorMsg] = useState("");
//   const [formLoader, setFormLoader] = useState(false);

//   // Demographic group variables
//   const [
//     demographicShortName,
//     setDemographicShortName,
//     resetDemographicShortName,
//   ] = useInputState("");
//   const [
//     demographicLongName,
//     setDemographicLongName,
//     resetDemographicLongName,
//   ] = useInputState("");
//   const [numOfAccounts, setNumOfAccounts, resetNumOfAccounts] = useInputState(
//     ""
//   );
//   const [emptyDemoShortNameError, setEmptyDemoShortNameError] = useState(false);
//   const [emptyDemoLongNameError, setEmptyDemoLongNameError] = useState(false);
//   const [emptyAccountError, setEmptyAccountError] = useState(false);

//   // Studio variables
//   const [
//     studioShortName,
//     setStudioShortName,
//     resetStudioShortName,
//   ] = useInputState("");
//   const [
//     studioLongName,
//     setStudioLongName,
//     resetStudioLongName,
//   ] = useInputState("");
//   const [emptyStudioShortNameError, setEmptyStudioShortNameError] = useState(
//     false
//   );
//   const [emptyStudioLongNameError, setEmptyStudioLongNameError] = useState(
//     false
//   );

//   // Streaming service variables
//   const [
//     streamShortName,
//     setStreamShortName,
//     resetStreamShortName,
//   ] = useInputState("");
//   const [
//     streamLongName,
//     setStreamgLongName,
//     resetStreamgLongName,
//   ] = useInputState("");
//   const [subPrice, setSubPrice, resetSubPrice] = useInputState("");
//   const [emptySubPriceError, setEmptySubPriceError] = useState(false);
//   const [emptyStreamShortNameError, setEmptyStreamShortNameError] = useState(
//     false
//   );
//   const [emptyStreamgLongNameError, setEmptyStreamLongNameError] = useState(
//     false
//   );

//   /**
//    * check whether a string is an integer
//    * @param {string} value
//    */
//   const isInt = (value) => {
//     return (
//       !isNaN(value) &&
//       parseInt(Number(value)) == value &&
//       !isNaN(parseInt(value, 10))
//     );
//   };

//   /**
//    * Clear form errors
//    * @param {Array} clearErrorFunctions
//    */
//   const clearFormErrors = (clearErrorFunctions) => {
//     clearErrorFunctions.forEach((clearErrorFunc) => {
//       clearErrorFunc(false);
//     });
//   };

//   /**
//    * Handle demographic form submit
//    */
//   const handleDemographicFormSubmit = async () => {
//     clearFormErrors([
//       setEmptyDemoShortNameError,
//       setEmptyDemoLongNameError,
//       setEmptyAccountError,
//       setFormError,
//     ]);
//     if (demographicShortName === "") {
//       setEmptyDemoShortNameError(true);
//       return;
//     }
//     if (demographicLongName === "") {
//       setEmptyDemoLongNameError(true);
//       return;
//     }
//     if (numOfAccounts === "") {
//       setEmptyAccountError(true);
//       return;
//     }
//     if (!isInt(numOfAccounts)) {
//       setFormError(true);
//       setFormErrorMsg("Number of accounts can only have digits!");
//       return;
//     }

//     // If no issues with form fields, submit the request
//     setFormLoader(true);
//     await createDemographicGroup(
//       demographicShortName,
//       demographicLongName,
//       numOfAccounts
//     );
//     resetDemographicShortName();
//     resetDemographicLongName();
//     resetNumOfAccounts();
//     setFormLoader(false);
//   };

//   /**
//    * Handle studio form submit
//    */
//   const handleStudioFormSubmit = async () => {
//     clearFormErrors([
//       setEmptyStudioShortNameError,
//       setEmptyStudioLongNameError,
//       setFormError,
//     ]);
//     if (studioShortName === "") {
//       setEmptyStudioShortNameError(true);
//       return;
//     }
//     if (studioLongName === "") {
//       setEmptyStudioLongNameError(true);
//       return;
//     }
//     setFormLoader(true);
//     await createStudio(studioShortName, studioLongName);
//     resetStudioShortName();
//     resetStudioLongName();
//     setFormLoader(false);
//   };

//   /**
//    * Handle streaming service form submit
//    */
//   const handleStreamFormSubmit = async () => {
//     clearFormErrors([
//       setEmptyStreamShortNameError,
//       setEmptyStreamLongNameError,
//       setFormError,
//     ]);
//     if (streamShortName === "") {
//       setEmptyStreamShortNameError(true);
//       return;
//     }
//     if (streamLongName === "") {
//       setEmptyStreamLongNameError(true);
//       return;
//     }
//     if (subPrice === "") {
//       setEmptySubPriceError(true);
//       return;
//     }
//     if (!isInt(subPrice)) {
//       console.log("sub price error!");
//       setFormError(true);
//       setFormErrorMsg("Subscription price can only have digits!");
//       return;
//     }
//     setFormLoader(true);
//     await createStream(streamShortName, streamLongName, subPrice);
//     resetStreamShortName();
//     resetStreamgLongName();
//     resetSubPrice();
//     setFormLoader(false);
//   };

//   /**
//    * Form for creating a new demographic group
//    */
//   const demographicForm = (
//     <>
//       <Form.Field>
//         <label>Short Name</label>
//         <Form.Input
//           fluid
//           placeholder="Short name"
//           type="text"
//           value={demographicShortName}
//           onChange={setDemographicShortName}
//           error={
//             emptyDemoShortNameError
//               ? {
//                   content: "Short name required!",
//                   pointing: "above",
//                 }
//               : null
//           }
//         />
//       </Form.Field>
//       <Form.Field>
//         <label>Long Name</label>
//         <Form.Input
//           fluid
//           placeholder="Long name"
//           type="text"
//           value={demographicLongName}
//           onChange={setDemographicLongName}
//           error={
//             emptyDemoLongNameError
//               ? {
//                   content: "Long name required!",
//                   pointing: "above",
//                 }
//               : null
//           }
//         />
//       </Form.Field>

//       <Form.Field>
//         <label>Number of Accounts</label>
//         <Form.Input
//           fluid
//           placeholder="Number of accounts"
//           type="text"
//           value={numOfAccounts}
//           onChange={setNumOfAccounts}
//           error={
//             emptyAccountError
//               ? {
//                   content: "Number of accounts required!",
//                   pointing: "above",
//                 }
//               : null
//           }
//         />
//       </Form.Field>
//       <Message error content={formErrorMsg} />
//       <Button
//         onClick={handleDemographicFormSubmit}
//         color="teal"
//         fluid
//         size="large"
//       >
//         Submit
//       </Button>
//     </>
//   );

//   /**
//    * Form for creating a new studio
//    */
//   const studioForm = (
//     <>
//       <Form.Field>
//         <label>Short Name</label>
//         <Form.Input
//           fluid
//           placeholder="Short name"
//           type="text"
//           value={studioShortName}
//           onChange={setStudioShortName}
//           error={
//             emptyStudioShortNameError
//               ? {
//                   content: "Short name required!",
//                   pointing: "above",
//                 }
//               : null
//           }
//         />
//       </Form.Field>
//       <Form.Field>
//         <label>Long Name</label>
//         <Form.Input
//           fluid
//           placeholder="Long name"
//           type="text"
//           value={studioLongName}
//           onChange={setStudioLongName}
//           error={
//             emptyStudioLongNameError
//               ? {
//                   content: "Long name required!",
//                   pointing: "above",
//                 }
//               : null
//           }
//         />
//       </Form.Field>
//       <Button onClick={handleStudioFormSubmit} color="teal" fluid size="large">
//         Submit
//       </Button>
//     </>
//   );

//   /**
//    * Form for creating a new streaming service
//    */
//   const streamingServiceForm = (
//     <>
//       <Form.Field>
//         <label>Short Name</label>
//         <Form.Input
//           fluid
//           placeholder="Short name"
//           type="text"
//           value={streamShortName}
//           onChange={setStreamShortName}
//           error={
//             emptyStreamShortNameError
//               ? {
//                   content: "Short name required!",
//                   pointing: "above",
//                 }
//               : null
//           }
//         />
//       </Form.Field>
//       <Form.Field>
//         <label>Long Name</label>
//         <Form.Input
//           fluid
//           placeholder="Long name"
//           type="text"
//           value={streamLongName}
//           onChange={setStreamgLongName}
//           error={
//             emptyStreamgLongNameError
//               ? {
//                   content: "Long name required!",
//                   pointing: "above",
//                 }
//               : null
//           }
//         />
//       </Form.Field>
//       <Form.Field>
//         <label>Subscription Price</label>
//         <Form.Input
//           fluid
//           placeholder="Subscription price"
//           type="text"
//           value={subPrice}
//           onChange={setSubPrice}
//           error={
//             emptySubPriceError
//               ? {
//                   content: "Subscription price required!",
//                   pointing: "above",
//                 }
//               : null
//           }
//         />
//       </Form.Field>
//       <Button onClick={handleStreamFormSubmit} color="teal" fluid size="large">
//         Submit
//       </Button>
//     </>
//   );

//   // Every time the URL path changes
//   useEffect(() => {
//     // Don't set any active item header
//     setActiveItem("");
//     // Change form's content accordingly
//     switch (match.params.name) {
//       case "stream":
//         setFormTitle("Streaming Service");
//         setFormContent(streamingServiceForm);
//         break;
//       case "demographic":
//         setFormTitle("Demographic Group");
//         setFormContent(demographicForm);
//         break;
//       case "studio":
//         setFormTitle("Studio");
//         setFormContent(studioForm);
//         break;
//       default:
//         break;
//     }
//   }, [match.params.name]);
//   let createNewForm = formContent;

//   return (
//     <>
//       <Container text>
//         <Segment>
//           <Header as="h2" color="teal" textAlign="center">
//             New {formTitle}
//           </Header>
//           <Form loading={formLoader} error={formError}>
//             {createNewForm}
//           </Form>
//         </Segment>
//       </Container>
//     </>
//   );
// };

// export default CreateNew;
