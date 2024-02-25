import React from "react";
import { Navigate } from "react-router-dom";

const authAdmin = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      if (localStorage.getItem("isAdminLogged") !== "true") {
        return <WrappedComponent {...this.props} />;
      }
      return <Navigate to="/user/admin/dashboard" />;
    }
  };
};
export default authAdmin;
