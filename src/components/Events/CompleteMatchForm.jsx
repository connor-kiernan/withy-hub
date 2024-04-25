import React, {useEffect, useRef, useState} from "react";
import {Button, CloseButton, Col, Form, OverlayTrigger, Row, Spinner, Toast, Tooltip} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectEventById, useCompleteMatchMutation} from "../../features/matches/matchSlice";
import "./CompleteMatchForm.css";

const CompleteMatchForm = () => {
  const {matchId} = useParams();
  const match = useSelector(selectEventById(matchId));
  const [homeGoals, setHomeGoals] = useState("");
  const [awayGoals, setAwayGoals] = useState("");
  const [goalScorers, setGoalScorers] = useState(null);
  const [scrollButton, setScrollButton] = useState("add");
  const buttonRef = useRef(null);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const [completeMatch, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useCompleteMatchMutation();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [homeTeam, awayTeam] = match?.isHomeGame ?
      ["Withington Hope", match.opponent] : [match.opponent, "Withington Hope"];
  const [homePlaceholder, awayPlaceholder] = match?.isHomeGame ? ["1", "0"] : ["0", "1"];

  const updateGoalScorer = (index, field, value) => {
    const data = [...goalScorers];
    data[index][field] = value;

    setGoalScorers(data);
  };

  const handleDelete = (index) => {
    const data = [...goalScorers];
    data.splice(index, 1);

    setGoalScorers(data.length === 0 ? null : data);
    setScrollButton("close" + index);
  };

  useEffect(() => {
    buttonRef?.current?.scrollIntoView();
  }, [goalScorers]);

  useEffect(() => {
    const withyGoals = parseInt((match?.isHomeGame ? homeGoals : awayGoals) ?? 0);
    const withyGoalScorerTotal = goalScorers?.map(({count}) => parseInt(count)).reduce((a, b) => a + b) ?? 0;

    const withyGoalsId = match?.isHomeGame ? "homeGoals" : "awayGoals";
    const withyGoalsInput = document.getElementById(withyGoalsId);

    if (withyGoals !== withyGoalScorerTotal) {
      withyGoalsInput.setCustomValidity("Number of goals does not match");
    } else {
      withyGoalsInput.setCustomValidity("");
    }

    //eslint-disable-next-line
  }, [homeGoals, awayGoals, goalScorers]);

  const submitForm = async (e) => {
    setValidated(true);
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;

    if (form.checkValidity() !== false) {
      setValidated(false);

      const withyGoalScorers = {};
      goalScorers.forEach(({name, count}) => withyGoalScorers[name] = parseInt(count));

      await completeMatch({
        id: match.id,
        homeGoals: parseInt(homeGoals),
        awayGoals: parseInt(awayGoals),
        withyGoalScorers
      });
    } else {
      setValidated(true);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      document.getElementById("completeMatchForm").reset();
      setHomeGoals("")
      setAwayGoals("")
      setGoalScorers(null)
      navigate("../");
    }
    // eslint-disable-next-line
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setShowError(true);
    }
  }, [isError]);

  return (
      <>
        <Form className="mt-4" noValidate onSubmit={submitForm} validated={validated} id="completeMatchForm">
          <legend className="h4 mb-4">{`${homeTeam} vs ${awayTeam}`}</legend>
          <fieldset className="mb-4">
            <legend>Score</legend>
            <Form.Group as={Row} controlId="homeGoals" className="align-items-center mb-2">
              <Col xs={8} md={6} lg={4}>
                <Form.Label className="mb-0">{homeTeam}</Form.Label>
              </Col>
              <Col xs={"auto"}>
                <Form.Control value={homeGoals} className="text-center" min={0} max={99} required type="number"
                              placeholder={homePlaceholder} onChange={e => setHomeGoals(e.target.value)}/>
              </Col>
              {match?.isHomeGame && (homeGoals ? <Form.Control.Feedback type="invalid">
                Number of Withy goals does not match goal scorers total
              </Form.Control.Feedback> : null)}
            </Form.Group>
            <Form.Group as={Row} controlId="awayGoals" className="align-items-center">
              <Col xs={8} md={6} lg={4}>
                <Form.Label className="mb-0">{awayTeam}</Form.Label>
              </Col>
              <Col xs={"auto"}>
                <Form.Control value={awayGoals} className="text-center" min={0} max={99} required type="number"
                              placeholder={awayPlaceholder} onChange={e => setAwayGoals(e.target.value)}/>
              </Col>
              {!match?.isHomeGame && (awayGoals ? <Form.Control.Feedback type="invalid">
                Number of Withy goals does not match goal-scorer totals
              </Form.Control.Feedback> : null)}
            </Form.Group>
          </fieldset>
          <fieldset>
            <legend>Withy Goal Scorers
              <OverlayTrigger placement="right" overlay={
                <Tooltip id="button-tooltip">
                  Enter the name in the format that should appear on the score sheet e.g.
                  <ul className="text-start">
                    <li>Doe</li>
                    <li>J. Doe</li>
                    <li>JD</li>
                  </ul>
                </Tooltip>
              }>
                <Button variant="light" className="bg-transparent border-0 fs-5">
                  <i className="fa-regular fa-circle-question"></i>
                </Button>
              </OverlayTrigger>
            </legend>
            {goalScorers?.map((goalScorer, index) => (
                <Row key={index} className="mb-2 align-items-end">
                  <Col xs={7}>
                    <Form.Group controlId={"goalScorer" + index}>
                      <Form.Label>{"Goal Scorer " + (index + 1)}</Form.Label>
                      <Form.Control autoFocus value={goalScorer.name ?? ""} type="text" placeholder="Smith"
                                    onChange={(e) => updateGoalScorer(index, "name", e.target.value)} required/>
                    </Form.Group>
                  </Col>
                  <Col xs={"auto"}>
                    <Form.Group controlId={"goalScorerGoals" + index}>
                      <Form.Label>Count</Form.Label>
                      <Form.Control value={goalScorer.count ?? ""} type="number" min="1" max="99" required placeholder="1"
                                    onChange={(e) => updateGoalScorer(index, "count", e.target.value)}/>
                    </Form.Group>
                  </Col>
                  <Col xs={1}>
                    <Form.Group controlId={"close" + index}>
                      <CloseButton ref={scrollButton === "close" + index ? buttonRef : null} className="mb-2"
                                   onClick={() => handleDelete(index)}/>
                    </Form.Group>
                  </Col>
                </Row>
            )).reduce((prev, current) => [prev, <hr key={prev}/>, current])}
            <Button className="my-2" ref={scrollButton === "add" ? buttonRef : null} onClick={() => {
              setGoalScorers(goalScorers ? [...goalScorers, {}] : [{}]);
              setScrollButton("add");
            }}><i className="fa-solid fa-plus"></i> Add Goal Scorer</Button>
          </fieldset>
          <Form.Group className="text-center my-4">
            <Button type="submit">{isLoading ? (
                    <Spinner as="span" animation="border" role="status" variant="secondary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>)
                : "Complete"}</Button>
          </Form.Group>
        </Form>
        <Toast onClose={() => setShowSuccess(false)} show={showSuccess} delay={3000} autohide
               className="position-fixed bottom-0 start-50 translate-middle-x mb-6">
          <div className="d-flex">
            <Toast.Body>Match completed successfully</Toast.Body>
            <CloseButton className="me-2 m-auto" data-bs-dismiss="toast" aria-label="close"/>
          </div>
        </Toast>
        <Toast onClose={() => setShowError(false)} show={showError} delay={6000} autohide
               className="position-fixed bottom-0 start-50 translate-middle-x mb-6">
          <div className="d-flex">
            <Toast.Body>Error completing match: {error?.data?.title}, please try again</Toast.Body>
            <CloseButton className="me-2 m-auto" data-bs-dismiss="toast" aria-label="close"/>
          </div>
        </Toast>
      </>
  );
};

export default CompleteMatchForm;