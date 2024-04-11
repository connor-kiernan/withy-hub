import React from "react";
import {Card, Col, Row} from "react-bootstrap";
import Date from "../Date";
import {Link} from "react-router-dom";

function resolveFooter(availability) {
  if (availability) {
    const comment = availability.comment ? ` (${availability.comment})` : "";
    let textClass = "text-bg-";
    switch (availability.status) {
      case "AVAILABLE":
        textClass += "success";
        break;
      case "UNAVAILABLE":
        textClass += "danger";
        break;
      case "IF_DESPERATE":
        textClass += "warning";
        break;
      case "FAN_CLUB":
        textClass += "primary";
        break;
      default:
        textClass += "";
    }
    const footer = `${availability.status.toLowerCase().replace("_", " ")}${comment}`;
    return ({footer, textClass});
  }

  return ({footer: "Not set", textClass: "text-bg-secondary"});
}

const AvailabilityCard = ({fixture, availability}) => {
  const {id, kickOffDateTime, address, isHomeGame, opponent} = fixture;

  const {footer, textClass} = resolveFooter(availability);

  const addressLine = <>{isHomeGame ? "Home" : "Away"} &#183; <span className="user-select-all">{address["line1"]}</span></>;

  return (
      <Card className="text-center">
        <Card.Body>
          <Card.Title className="text-captialize mb-3">{opponent}</Card.Title>
          <Card.Subtitle><Date date={kickOffDateTime} withTime={true}/></Card.Subtitle>
          <Card.Text className="text-secondary small mt-2">{addressLine}</Card.Text>
        </Card.Body>
        <Card.Footer className={`${textClass} text-capitalize`}>
          <Link to={id} className="text-reset text-decoration-none">
            <Row className="justify-content-center position-relative">
              <Col>{footer}</Col>
              <Col xs={"auto"} className="position-absolute bottom-0 end-0">
                <i className="fa-solid fa-arrow-right"></i>
              </Col>
            </Row>
          </Link>
        </Card.Footer>
      </Card>
  )
};

export default AvailabilityCard;