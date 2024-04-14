import React from "react";
import './Strip.css'
import {Col, Row} from "react-bootstrap";

const Kit = ({isHomeKit}) => {
  const kitName = resolveKitName(isHomeKit);
  return (
      <Row className="text-capitalize mb-0">
        <Col xs={2} className="text-center">
          <i className={`fa-solid fa-shirt ${kitName}`}></i>
        </Col>
        <Col>
          {kitName} kit
        </Col>
      </Row>
  );
};

function resolveKitName(isHomeKit) {
  if (isHomeKit == null) {
    return "Unknown"
  }

  return isHomeKit ? "home" : "away";
}
export default Kit;