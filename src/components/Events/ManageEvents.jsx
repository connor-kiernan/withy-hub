import React, {useState} from "react";
import {Dropdown, DropdownButton, Row} from "react-bootstrap";
import {Outlet, useLocation, useNavigate} from "react-router-dom";

const ManageEvents = () => {
  const location = useLocation();
  const isUpcoming = location.pathname === "/events/manage/upcoming" || location.pathname === "/events/manage";
  const [dropDownTitle, setDropDownTitle] = useState(isUpcoming ? "Upcoming" : "Previous");
  const navigate = useNavigate();

  return (
      <>
        <Row className="mt-3 mb-4">
          <DropdownButton id="dropdown-basic-button" title={dropDownTitle} variant="secondary">
            <Dropdown.Item as="button" onClick={() => {
              setDropDownTitle("Upcoming");
              navigate("upcoming")
            }}>Upcoming</Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => {
              setDropDownTitle("Previous");
              navigate("previous")
            }}>Previous</Dropdown.Item>
          </DropdownButton>
        </Row>
        <Row>
          <Outlet />
        </Row>
      </>
  );
};

export default ManageEvents;