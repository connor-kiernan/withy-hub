import React from "react";
import {useSelector} from "react-redux";
import {selectEventById} from "../../features/matches/matchSlice";
import {Accordion, Col, ListGroup, Row} from "react-bootstrap";
import {useParams} from "react-router-dom";
import FormattedDate from "../FormattedDate";
import Address from "../Address";
import Kit from "./Kit";
import "./MatchAvailability.css";
import {SoccerFootballField} from "@vectopus/atlas-icons-react";
import AvailabilityForm from "./AvailabilityForm";
import MatchAvailabilityTable from "./MatchAvailabilityTable";
import {store} from "../../app/store";
import {playerApiSlice} from "../../features/players/playerSlice";

store.dispatch(playerApiSlice.endpoints.getPlayers.initiate());

const MatchAvailability = () => {
  const {fixtureId} = useParams();
  const fixture = useSelector(selectEventById(fixtureId));
  const {opponent, kickOffDateTime, address, isHomeKit, pitchType, playerAvailability, eventType} = fixture;

  return (
      <>
        <Row>
          <Col>
            <h1>{opponent}</h1>
            <Accordion className="my-2">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Details</Accordion.Header>
                <Accordion.Body className="p-0">
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item>
                      <Row className="align-items-center">
                        <Col xs={2} className="text-center">
                          <i className="fa-regular fa-calendar"></i>
                        </Col>
                        <Col>
                          <FormattedDate instant={kickOffDateTime}/>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    {eventType !== "TRAINING" && <ListGroup.Item><Kit isHomeKit={isHomeKit}/></ListGroup.Item>}
                    {((eventType !== "TRAINING") || (eventType !== "GAME")) && <ListGroup.Item>
                      <Row className="align-items-center">
                        <Col xs={2} className="text-center">
                          <SoccerFootballField/>
                        </Col>
                        <Col>{pitchType ?? "Unknown"}</Col>
                      </Row>
                    </ListGroup.Item>}
                    <ListGroup.Item>
                      <Row>
                        <Col xs={2} className="text-center">
                          <i className="fa-solid fa-location-dot"></i>
                        </Col>
                        <Col className="user-select-all">
                          <Address address={address}/>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Availability</Accordion.Header>
                <Accordion.Body>
                  <AvailabilityForm playerAvailability={playerAvailability} matchId={fixtureId} isGame={eventType === "GAME"}/>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <MatchAvailabilityTable playerAvailability={playerAvailability} />
          </Col>
        </Row>
      </>
  )
}

export default MatchAvailability;