import React from "react";
import {useSelector} from "react-redux";
import {selectCurrentRoles} from "./authSlice";
import {Navigate, Outlet} from "react-router-dom";

const RequireRoles = ({allowedRoles}) => {
  const roles = useSelector(selectCurrentRoles);

  if(roles?.length) {
    if (roles.some(role => allowedRoles.includes(role))) {
      return <Outlet />
    }
  }

  return <Navigate to={"/"} replace />
};

export default RequireRoles;