import React from "react";
import {Card, Col, Row} from "react-bootstrap";
import FormattedDate from "../FormattedDate";
import {Link} from "react-router-dom";

export function resolveAvailabilityVariant(status) {
  switch (status) {
    case "AVAILABLE":
      return "success";
    case "UNAVAILABLE":
      return "danger";
    case "IF_DESPERATE":
      return "warning";
    case "FAN_CLUB":
      return "primary";
    default:
      return "secondary";
  }
}

export function normaliseAvailability(availability) {
  if (availability) {
    const comment = availability.comment ? ` (${availability.comment})` : "";
    let variant = resolveAvailabilityVariant(availability.status);
    const text = `${availability.status.toLowerCase().replace("_", " ")}${comment}`;
    return ({text, variant});
  }

  return ({text: "Not set", variant: "secondary"});
}

const AvailabilityCard = ({event, availability}) => {
  const {id, kickOffDateTime, address, isHomeGame, opponent, eventType} = event;

  const {text, variant} = normaliseAvailability(availability);

  const addressLine = <>{eventType !== "GAME" ? eventType.toLowerCase() : isHomeGame ? "Home" : "Away"} &#183; <span className="user-select-all">{address["line1"]}</span></>;

  return (
      <Card className="text-center">
        <Card.Body>
          <Card.Title className="text-captialize mb-3">{opponent}</Card.Title>
          <Card.Subtitle><FormattedDate instant={kickOffDateTime} withTime={true}/></Card.Subtitle>
          <Card.Text className="text-secondary text-capitalize small mt-2">{addressLine}</Card.Text>
        </Card.Body>
        <Card.Footer className={`text-bg-${variant} text-capitalize`}>
          <Link to={id} className="text-reset text-decoration-none">
            <Row className="justify-content-center position-relative">
              <Col>{text}</Col>
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