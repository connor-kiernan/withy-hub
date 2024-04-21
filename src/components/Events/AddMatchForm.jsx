import React, {useEffect, useState} from "react";
import {Button, CloseButton, Col, Form, Row, Spinner, Toast} from "react-bootstrap";
import {selectEventExists, useAddEventMutation} from "../../features/matches/matchSlice";
import {useSelector} from "react-redux";

const AddMatchForm = () => {
  const getDefaultTrainingDate = (kickOffDateTime) => {
    const date = new Date(kickOffDateTime);
    date.setDate(date.getDate() - (3 - (7 - date.getDay())) % 7);

    return date.toISOString().split("T")[0] + "T20:00"
  }

  const formattedDate = new Date().toISOString().split("T")[0] + "T10:15";
  const [validated, setValidated] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [opponent, setOpponent] = useState("");
  const [kickOffDateTime, setKickOffDateTime] = useState(formattedDate);
  const [isHomeGame, setIsHomeGame] = useState(true);
  const [isHomeKit, setIsHomeKit] = useState(true);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [postcode, setPostcode] = useState("");
  const [pitchType, setPitchType] = useState("Grass");

  const [trainingKickOffDateTime, setTrainingKickOffDateTime] = useState(getDefaultTrainingDate(kickOffDateTime));

  const [addEvent, {isLoading, isSuccess, isError, error}] = useAddEventMutation();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [customError, setCustomError] = useState("");
  const eventExists = useSelector(selectEventExists(kickOffDateTime));
  const trainingEventExists = useSelector(selectEventExists(trainingKickOffDateTime));

  const [addTrainingSession, setAddTrainingSession] = useState(false);

  const populateHomeAddress = () => {
    setAddress1("Hough End Playing Fields");
    setAddress2("480 Princess Rd");
    setPostcode("M20 1HP");
    setPitchType("Grass");
  }

  const clearAddress = () => {
    setAddress1("");
    setAddress2("");
    setPostcode("");
    setPitchType("");
  }

  const submitForm = async (e) => {
    setDisabled(true);
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;

    if (form.checkValidity() !== false) {
      setValidated(false);

      if (eventExists) {
        setCustomError("Match already exists at that time");
        setShowError(true);
      } else if (addTrainingSession && trainingEventExists) {
        setCustomError("Training already exists at that time");
        setShowError(true);
      } else {
        await addEvent({
          opponent,
          kickOffDateTime,
          isHomeGame,
          isHomeKit,
          address1,
          address2,
          postcode,
          pitchType,
          eventType: "GAME"
        });


        if (addTrainingSession) {
          await addEvent({
            opponent: "Training",
            kickOffDateTime: trainingKickOffDateTime,
            address1: "The Armitage Sports Centre",
            address2: "Moseley Rd",
            postcode: "M14 6PA",
            pitchType: "Astro Turf",
            eventType: "TRAINING"
          })
        }
      }
    } else {
      setValidated(true);
    }

    setDisabled(false);
  };

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      document.getElementById("addMatchForm").reset();
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
        <Form noValidate onSubmit={submitForm} validated={validated} id="addMatchForm">
          <Row className="mb-4">
            <fieldset disabled={disabled}>
              <Row className="gy-4">
                <Form.Group controlId="opponent">
                  <Form.Label>Opponent</Form.Label>
                  <Form.Control defaultValue="" type="text" required onChange={e => setOpponent(e.target.value)}/>
                </Form.Group>
                <Form.Group controlId="dateTime">
                  <Form.Label>Kick Off</Form.Label>
                  <Form.Control defaultValue={formattedDate} type="datetime-local" min={formattedDate} required
                                onChange={e => {
                                  setKickOffDateTime(e.target.value);
                                  setTrainingKickOffDateTime(getDefaultTrainingDate(e.target.value))
                                }}/>
                </Form.Group>
                <Row className="mt-4">
                  <Col xs={6}>
                    <Form.Group controlId="homeGame">
                      <Form.Check className="noValidate" label="Home game" name="homeGame" type="radio" required
                                  onChange={() => {
                                    setIsHomeGame(true);
                                    populateHomeAddress();
                                  }}/>
                    </Form.Group>
                    <Form.Group controlId="awayGame">
                      <Form.Check className="noValidate" label="Away game" name="homeGame" type="radio" required
                                  onChange={() => {
                                    setIsHomeGame(false);
                                    clearAddress()
                                  }}/>
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group controlId="homekit">
                      <Form.Check className="noValidate" label="Home kit" name="kit" type="radio" required
                                  onChange={() => setIsHomeKit(true)}/>
                    </Form.Group>
                    <Form.Group className="awayKit">
                      <Form.Check className="noValidate" label="Away kit" name="kit" type="radio" required
                                  onChange={() => setIsHomeKit(false)}/>
                    </Form.Group>
                  </Col>
                </Row>
                <fieldset className="mt-4 mb-2" id="addressFieldSet">
                  <legend>Address</legend>
                  <Form.Group className="mb-2" controlId="address1">
                    <Form.Label>Address Line 1</Form.Label>
                    <Form.Control value={address1} type="text" required onChange={e => setAddress1(e.target.value)}/>
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="address2">
                    <Form.Label>Address Line 2 (Optional)</Form.Label>
                    <Form.Control value={address2} className="noValidate" type="text" onChange={e => setAddress2(e.target.value)}/>
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="postcode">
                    <Form.Label>Postcode</Form.Label>
                    <Form.Control value={postcode} type="text" required pattern="^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$"
                                  onChange={e => setPostcode(e.target.value)}/>
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="pitchType">
                    <Form.Label>Pitch Type</Form.Label>
                    <Form.Select value={pitchType} required onChange={e => setPitchType(e.target.value)}>
                      <option value="Grass">Grass</option>
                      <option value="Astro Turf">Astro Turf</option>
                    </Form.Select>
                  </Form.Group>
                </fieldset>

                <Form.Group>
                 <Form.Check className="noValidate" label="Add Training Session?" type="checkbox" onChange={() => setAddTrainingSession(!addTrainingSession)}/>
                </Form.Group>

                {addTrainingSession &&
                    <fieldset>
                      <Form.Group controlId="trainingDateTime">
                        <Form.Label>Session Date</Form.Label>
                        <Form.Control value={trainingKickOffDateTime} type="datetime-local" min={formattedDate} required
                                      onChange={e => setTrainingKickOffDateTime(e.target.value)}/>
                      </Form.Group>
                    </fieldset>
                }

                <Form.Group className="text-center">
                  <Button type="submit">{isLoading ? (
                          <Spinner as="span" animation="border" role="status" variant="secondary">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>)
                      : "Add Match"}</Button>
                </Form.Group>
              </Row>
            </fieldset>
          </Row>
        </Form>
        <Toast onClose={() => setShowSuccess(false)} show={showSuccess} delay={3000} autohide
               className="position-fixed bottom-0 start-50 translate-middle-x mb-6">
          <div className="d-flex">
            <Toast.Body>Match added successfully</Toast.Body>
            <CloseButton className="me-2 m-auto" data-bs-dismiss="toast" aria-label="close"/>
          </div>
        </Toast>
        <Toast onClose={() => setShowError(false)} show={showError} delay={6000} autohide
               className="position-fixed bottom-0 start-50 translate-middle-x mb-6">
          <div className="d-flex">
            <Toast.Body>Error adding match: {error?.data?.title ?? customError}, please try again</Toast.Body>
            <CloseButton className="me-2 m-auto" data-bs-dismiss="toast" aria-label="close"/>
          </div>
        </Toast>
      </>
  );
};

export default AddMatchForm;