import React from "react";
import { Navigate } from "react-router-dom";

const authCoordint = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      if (localStorage.getItem("isCoordinatorLogged") !== "true") {
        return <WrappedComponent {...this.props} />;
      }
      return <Navigate to="/user/hod/dashboard" />;
    }
  };
};
export default authCoordint;
