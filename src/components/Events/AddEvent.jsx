import React, {useState} from "react";
import {Dropdown, DropdownButton, Row} from "react-bootstrap";
import AddMatchForm from "./AddMatchForm";
import AddTrainingForm from "./AddTrainingForm";
import AddOtherEventForm from "./AddOtherEventForm";

const AddEvent = () => {
  const [dropDownTitle, setDropDownTitle] = useState("Add Match");
  const [form, setForm] = useState(<AddMatchForm/>);

  return (
      <>
        <Row className="mt-3 mb-4">
          <DropdownButton id="dropdown-basic-button" title={dropDownTitle} variant="secondary">
            <Dropdown.Item as="button" onClick={() => {
              setDropDownTitle("Add Match");
              setForm(<AddMatchForm/>);
            }}>Add Match</Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => {
              setDropDownTitle("Add Training");
              setForm(<AddTrainingForm/>);
            }}>Add Training</Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => {
              setDropDownTitle("Add Other");
              setForm(<AddOtherEventForm/>);
            }}>Add Other</Dropdown.Item>
          </DropdownButton>
        </Row>
        <Row>
          {form}
        </Row>
      </>
  );
};

export default AddEvent;