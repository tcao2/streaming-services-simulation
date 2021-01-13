import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../auth";

const ProtectedRoute = ({
  component: Comp,
  path,
  authorizedRoles,
  ...restOfProps
}) => {
  /**
   * Check whether or not the user has valid role
   */
  const hasValidRole = () => {
    return authorizedRoles.includes(auth.getRole());
  };
  return (
    <Route
      path={path}
      {...restOfProps}
      render={(routeProps) => {
        // If the user is not authenticated, redirect to login page
        if (!auth.isAuthenticated()) {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  prevLocation: path,
                  error: "Please log in first!",
                },
              }}
            />
          );
        }
        // If the user is authenticated but do not have the required role
        else if (auth.isAuthenticated() && !hasValidRole()) {
          return (
            <Redirect
              to={{
                pathname: "/unauthorized",
                state: {
                  prevLocation: path,
                  error: "You do not have permission!",
                },
              }}
            />
          );
        }
        // If the user is authenticated AND have the required role, grant access
        return <Comp {...routeProps} {...restOfProps} />;
      }}
    />
  );
};

export default ProtectedRoute;
