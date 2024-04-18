import React, {useEffect, useState} from "react";
import {Button, CloseButton, Col, Form, Row, Spinner, Toast} from "react-bootstrap";
import {useAddEventMutation} from "../../features/matches/matchSlice";

const AddMatchForm = () => {
  const date = new Date().toISOString().split("T")[0] + "T10:15";
  const [validated, setValidated] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [opponent, setOpponent] = useState("");
  const [kickOffDateTime, setKickOffDateTime] = useState(date);
  const [isHomeGame, setIsHomeGame] = useState(true);
  const [isHomeKit, setIsHomeKit] = useState(true);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [postcode, setPostcode] = useState("");
  const [pitchType, setPitchType] = useState("Grass");

  const [addEvent, {isLoading, isSuccess, isError, error}] = useAddEventMutation();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

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
                  <Form.Control defaultValue={date} type="datetime-local" min={date} required
                                onChange={e => setKickOffDateTime(e.target.value)}/>
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
            <Toast.Body>Error adding match: {error?.data?.title}, please try again</Toast.Body>
            <CloseButton className="me-2 m-auto" data-bs-dismiss="toast" aria-label="close"/>
          </div>
        </Toast>
      </>
  );
};

export default AddMatchForm;