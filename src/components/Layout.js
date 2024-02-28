import React from "react";
import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";

const Layout = () => {
  return (
    <>
      <DashHeader />
      <Outlet />
    </>
  );
};

export default Layout;
