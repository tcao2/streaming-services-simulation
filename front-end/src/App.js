import React, { useState } from "react";
import OfferDataTable from "./components/offer/OfferDataTable";
import EventDataTable from "./components/event/EventDataTable";
import DemographicGroupDataTable from "./components/demographicGroup/DemographicGroupDataTable";
import StudioDataTable from "./components/studio/StudioDataTable";
import StreamServiceDataTable from "./components/streamingService/StreamServiceDataTable";
import DemographicGroupDetails from "./components/demographicGroup/DemographicGroupDetails";
import StreamingServiceDetails from "./components/streamingService/StreamingServiceDetails";
import StudioDetails from "./components/studio/StudioDetails";
import AvailableEvents from "./components/event/AvailableEvents";
import OfferEvent from "./components/event/OfferEvent";
import WatchEvent from "./components/event/WatchEvent";
import Home from "./components/Home";
import Login from "./components/Login";
import Unauthorized from "./components/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import CreateNewTemplate from "./components/createNewEntity/CreateNewTemplate";
import UpdateTemplate from "./components/updateEntity/UpdateTemplate";

const ROUTE_ROLE_MAPPING = {
  "/offers": ["admin", "demo", "stream"],
  "/events": ["admin", "studio"],
  "/streams": ["admin"],
  "/studios": ["admin"],
  "/demographicGroups": ["admin"],
  "/new/event": ["studio"],
  "/new/:name": ["admin"],
  "/update/:entity/:name": ["stream", "demo"],
  "/demographicGroups/:name": ["admin", "demo"],
  "/availableEvents": ["stream"],
  "/offerEvent": ["stream"],
  "/streamingServices/:name": ["admin", "stream"],
  "/studios/:name": ["admin", "studio"],
  "/watch": ["demo"],
};
const PUBLIC_ROUTES = [{ name: "Home", key: "/", to: "/" }];
const PROTECTED_ROUTES = [
  {
    name: "Offers",
    key: "offers",
    to: "/offers",
    authorizedRoles: ROUTE_ROLE_MAPPING["/offers"],
  },
  {
    name: "Events",
    key: "events",
    to: "/events",
    authorizedRoles: ROUTE_ROLE_MAPPING["/events"],
  },
  {
    name: "Streaming Services",
    key: "streams",
    to: "/streams",
    authorizedRoles: ROUTE_ROLE_MAPPING["/streams"],
  },
  {
    name: "Studios",
    key: "studios",
    to: "/studios",
    authorizedRoles: ROUTE_ROLE_MAPPING["/studios"],
  },
  {
    name: "Demographic Groups",
    key: "demos",
    to: "/demographicGroups",
    authorizedRoles: ROUTE_ROLE_MAPPING["/demographicGroups"],
  },
];

// const randomEvents = DataGenerator.generateEvents(10);
// const randomOffers = DataGenerator.generateOffers(10);

const App = () => {
  const [activeItem, setActiveItem] = useState("Home");
  return (
    <>
      <Router>
        <div>
          {/* Passing activeItem and setActiveItem to NavBar component */}
          <NavBar
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            publicRoutes={PUBLIC_ROUTES}
            protectedRoutes={PROTECTED_ROUTES}
          />
          <div
            className="ui container"
            style={{ marginTop: "50px", marginBottom: "25px" }}
          >
            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Switch>
              <Route
                exact
                path="/login"
                render={(props) => (
                  <Login {...props} setActiveItem={setActiveItem} />
                )}
              />
              <ProtectedRoute
                authorizedRoles={ROUTE_ROLE_MAPPING["/offers"]}
                exact
                path="/offers"
                component={OfferDataTable}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                tableHeader={"This Month's Offers"}
              />
              <ProtectedRoute
                authorizedRoles={ROUTE_ROLE_MAPPING["/events"]}
                exact
                path="/events"
                component={EventDataTable}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                tableHeader={"Events"}
              />

              <ProtectedRoute
                authorizedRoles={ROUTE_ROLE_MAPPING["/availableEvents"]}
                exact
                path="/availableEvents"
                component={AvailableEvents}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                tableHeader={"Events available for licensing"}
              />

              <ProtectedRoute
                authorizedRoles={ROUTE_ROLE_MAPPING["/offerEvent"]}
                exact
                path="/offerEvent"
                component={OfferEvent}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
              />

              <ProtectedRoute
                authorizedRoles={ROUTE_ROLE_MAPPING["/demographicGroups"]}
                exact
                path="/demographicGroups"
                component={DemographicGroupDataTable}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                tableHeader={"Demographic Groups"}
              />

              <ProtectedRoute
                authorizedRoles={ROUTE_ROLE_MAPPING["/studios"]}
                exact
                path="/studios"
                component={StudioDataTable}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                tableHeader={"Studios"}
              />

              <ProtectedRoute
                authorizedRoles={ROUTE_ROLE_MAPPING["/streams"]}
                exact
                path="/streams"
                component={StreamServiceDataTable}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                tableHeader={"Streaming Services"}
              />

              <ProtectedRoute
                authorizedRoles={ROUTE_ROLE_MAPPING["/new/event"]}
                exact
                path="/new/event"
                routeName="event"
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                component={CreateNewTemplate}
              />

              <ProtectedRoute
                authorizedRoles={ROUTE_ROLE_MAPPING["/watch"]}
                exact
                path="/watch"
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                component={WatchEvent}
              />

              <ProtectedRoute
                authorizedRoles={ROUTE_ROLE_MAPPING["/new/:name"]}
                exact
                path="/new/:name"
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                component={CreateNewTemplate}
              />

              <ProtectedRoute
                authorizedRoles={ROUTE_ROLE_MAPPING["/update/:entity/:name"]}
                exact
                path="/update/:entity/:name"
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                component={UpdateTemplate}
              />

              <ProtectedRoute
                authorizedRoles={ROUTE_ROLE_MAPPING["/studios/:name"]}
                exact
                path="/studios/:name"
                setActiveItem={setActiveItem}
                component={StudioDetails}
              />
              <ProtectedRoute
                authorizedRoles={ROUTE_ROLE_MAPPING["/streamingServices/:name"]}
                exact
                path="/streamingServices/:name"
                setActiveItem={setActiveItem}
                component={StreamingServiceDetails}
              />
              <ProtectedRoute
                authorizedRoles={ROUTE_ROLE_MAPPING["/demographicGroups/:name"]}
                exact
                path="/demographicGroups/:name"
                setActiveItem={setActiveItem}
                component={DemographicGroupDetails}
              />

              <Route exact path="/home" component={Home} />
              <Route exact path="/" component={Home} />
              <Route exact path="/unauthorized" component={Unauthorized} />
              <Route path="*" component={() => <div>404 NOT FOUND</div>} />
            </Switch>
          </div>
        </div>
      </Router>
    </>
  );
};

export default App;
