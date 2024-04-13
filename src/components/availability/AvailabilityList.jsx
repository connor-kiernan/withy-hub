import React from "react";
import {useSelector} from "react-redux";
import {selectAvailabilityByUserSub} from "../../features/matches/matchSlice";
import {Col, Row} from "react-bootstrap";
import AvailabilityCard from "./AvailabilityCard";
import {selectCurrentUser} from "../../features/auth/authSlice";

const AvailabilityList = () => {
  const currentUser = useSelector(selectCurrentUser);
  const availabilities = useSelector(selectAvailabilityByUserSub(currentUser));

  return (
      <Row xs={1} md={2} className="gy-3 pb-2">
        <Col md={12} xl={6}>
          <AvailabilityCard fixture={availabilities[0].fixture} availability={availabilities[0].availability} />
        </Col>
        {availabilities.slice(1).map(matchAvailability => (
            <Col key={matchAvailability.fixture.kickOffDateTime}>
              <AvailabilityCard fixture={matchAvailability.fixture} availability={matchAvailability.availability} />
            </Col>
        ))}
      </Row>
  );
};

export default AvailabilityList;