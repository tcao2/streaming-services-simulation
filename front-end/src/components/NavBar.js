import React, { useState, useEffect } from "react";
import { Menu, Dropdown, Icon } from "semantic-ui-react";
import { Link, withRouter, useHistory } from "react-router-dom";
import auth from "../auth";
import { getCurrentTime, toNextTime } from "../apis/Admin";

const NavBar = ({
  publicRoutes,
  protectedRoutes,
  setActiveItem,
  activeItem,
}) => {
  const history = useHistory();
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const getTime = async () => {
      if (auth.isAuthenticated()) {
        const currentTime = await getCurrentTime();
        setCurrentTime(currentTime);
      }
    };
    getTime();
  }, [auth.isAuthenticated()]);

  /**
   * Advance to next month
   */
  const advanceToNextMonth = () => {
    toNextTime().then(() => {
      getCurrentTime().then((currentTime) => {
        setCurrentTime(currentTime);
      });
    });
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    auth.logout(() => {
      // Redirect to home
      history.push("/");
      setActiveItem("Home");
    });
  };

  /**
   * Manage active menu
   * @param {String} name
   */
  const setActiveItemOnClick = (name) => {
    setActiveItem(name);
  };

  /**
   * Contains all public routes
   */
  const publicLinks = publicRoutes.map((publicRoute) => {
    return (
      <Menu.Item
        key={publicRoute.key}
        as={Link}
        to={publicRoute.to}
        name={publicRoute.name}
        active={activeItem === publicRoute.name}
        onClick={() => setActiveItemOnClick(publicRoute.name)}
      >
        {publicRoute.name}
      </Menu.Item>
    );
  });

  const protectedLinks = protectedRoutes
    .filter((route) => route.authorizedRoles.includes(auth.getRole()))
    .map((protectedRoute) => {
      return (
        <Menu.Item
          key={protectedRoute.key}
          as={Link}
          to={protectedRoute.to}
          name={protectedRoute.name}
          active={activeItem === protectedRoute.name}
          onClick={() => setActiveItemOnClick(protectedRoute.name)}
        >
          {protectedRoute.name}
        </Menu.Item>
      );
    });

  /**
   * Logout btn and time
   */
  const trigger = (
    <span>
      <Icon name="user" /> {auth.isAuthenticated() ? auth.getUsername() : "N/A"}
    </span>
  );
  const rightMenus = (
    <Menu.Menu position="right">
      <Menu.Item>
        <Icon name="calendar alternate outline" /> {currentTime}
      </Menu.Item>
      <Dropdown item trigger={trigger}>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleLogout}>
            Logout <Icon name="sign out alternate" />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );

  /**
   * Only shows protected routes if the user is authenticated
   */
  const privateLinks = auth.isAuthenticated() ? protectedLinks : null;

  /**
   * Admin-only actions
   */
  const adminActions = (
    <Dropdown.Menu>
      <Dropdown.Item>
        <Link to="/new/demographic">Create Demographic Group</Link>
      </Dropdown.Item>
      <Dropdown.Item>
        <Link to="/new/studio">Create Studio</Link>
      </Dropdown.Item>
      <Dropdown.Item>
        <Link to="/new/stream">Create Streaming Service</Link>
      </Dropdown.Item>
      <Dropdown.Item onClick={advanceToNextMonth}>Next Month</Dropdown.Item>
    </Dropdown.Menu>
  );

  /**
   * Studio-only actions
   */
  const studioActions = (
    <Dropdown.Menu>
      <Dropdown.Item>
        <Link to={`/studios/${auth.getUsername()}`}>View Account Details</Link>
      </Dropdown.Item>
      <Dropdown.Item>
        <Link to="/new/event">Create Event</Link>
      </Dropdown.Item>
    </Dropdown.Menu>
  );

  /**
   * Demographic group actions
   */
  const demographicActions = (
    <Dropdown.Menu>
      <Dropdown.Item>
        <Link to={`/demographicGroups/${auth.getUsername()}`}>
          View Account Details
        </Link>
      </Dropdown.Item>
      <Dropdown.Item>
        <Link to={`/update/demographic/${auth.getUsername()}`}>
          Update Account Info
        </Link>
      </Dropdown.Item>
      <Dropdown.Item>
        <Link to="/watch">Watch an Event</Link>
      </Dropdown.Item>
    </Dropdown.Menu>
  );

  /**
   * Streaming service actions
   */
  const streamActions = (
    <Dropdown.Menu>
      <Dropdown.Item>
        <Link to={`/streamingServices/${auth.getUsername()}`}>
          View Account Details
        </Link>
      </Dropdown.Item>
      <Dropdown.Item>
        <Link to={`/update/stream/${auth.getUsername()}`}>
          Update Account Info
        </Link>
      </Dropdown.Item>
      <Dropdown.Item>
        <Link to="/offerEvent">Offer an Event</Link>
      </Dropdown.Item>
    </Dropdown.Menu>
  );

  /**
   * Authorized actions for a given role
   * @param {String} role
   */
  const actions = (role) => {
    switch (role) {
      case "admin":
        return adminActions;
      case "studio":
        return studioActions;
      case "demo":
        return demographicActions;
      case "stream":
        return streamActions;
      default:
        return null;
    }
  };

  return (
    <div>
      <Menu stackable pointing secondary>
        {publicLinks}
        {privateLinks}
        {auth.isAuthenticated() && (
          <Dropdown
            item
            text="Actions"
            onClick={() => setActiveItemOnClick("Actions")}
          >
            {actions(auth.getRole())}
          </Dropdown>
        )}

        {auth.isAuthenticated() ? rightMenus : null}
      </Menu>
    </div>
  );
};

export default withRouter(NavBar);
