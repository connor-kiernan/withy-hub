import React from "react";
import {useSelector} from "react-redux";
import {selectAvailabilityByUserSub} from "../../features/matches/matchSlice";
import {Col, Row} from "react-bootstrap";
import AvailabilityCard from "./AvailabilityCard";
import {selectCurrentUser} from "../../features/auth/authSlice";

const AvailabilityList = () => {
  const currentUser = useSelector(selectCurrentUser);
  const availabilities = useSelector(selectAvailabilityByUserSub(currentUser));

  if (availabilities.length === 0) {
    return <p className="text-center mt-5">No Events to Show</p>
  }

  return (
      <Row xs={1} md={2} className="gy-3 pb-2">
        <Col md={12} xl={6}>
          <AvailabilityCard event={availabilities[0].event} availability={availabilities[0].availability} />
        </Col>
        {availabilities.slice(1).map(matchAvailability => (
            <Col key={matchAvailability.event.kickOffDateTime}>
              <AvailabilityCard event={matchAvailability.event} availability={matchAvailability.availability} />
            </Col>
        ))}
      </Row>
  );
};

export default AvailabilityList;