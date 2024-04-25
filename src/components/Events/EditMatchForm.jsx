import React, {useEffect, useState} from "react";
import {useEditEventMutation} from "../../features/matches/matchSlice";
import {Button, CloseButton, Col, Form, Row, Spinner, Toast} from "react-bootstrap";

const EditMatchForm = ({match}) => {
  const [validated, setValidated] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const dateObj = new Date(match.kickOffDateTime);
  const dateIso = dateObj.toISOString().split("T")[0] + "T" + dateObj.toLocaleTimeString();
  const date = dateIso.substring(0, dateIso.lastIndexOf(":"));

  const [opponent, setOpponent] = useState(match.opponent);
  const [kickOffDateTime, setKickOffDateTime] = useState(date);
  const [isHomeGame, setIsHomeGame] = useState(match.isHomeGame);
  const [isHomeKit, setIsHomeKit] = useState(match.isHomeKit);
  const [address1, setAddress1] = useState(match.address.line1);
  const [address2, setAddress2] = useState(match.address.line2 ?? "");
  const [postcode, setPostcode] = useState(match.address.postcode);
  const [pitchType, setPitchType] = useState(match.pitchType);

  const [editEvent, {isLoading, isSuccess, isError, error}] = useEditEventMutation();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const clearAddress = () => {
    setAddress1("");
    setAddress2("");
    setPostcode("");
    setPitchType("");
  };

  const populateHomeAddress = () => {
    setAddress1("Hough End Playing Fields");
    setAddress2("480 Princess Rd");
    setPostcode("M20 1HP");
    setPitchType("Grass");
  }

  const submitForm = async (e) => {
    setDisabled(true);
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;

    if (form.checkValidity()!== false) {
      setValidated(false);
      await editEvent({
        id: match.id,
        opponent,
        kickOffDateTime,
        isHomeGame,
        isHomeKit,
        address1,
        address2,
        postcode,
        pitchType
      });
    } else {
      setValidated(true);
    }
    setDisabled(false);
  };

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      document.getElementById("editMatchForm").reset();
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
        <Form noValidate onSubmit={submitForm} validated={validated} id="editMatchForm">
          <legend>Edit Match</legend>
          <Row className="mb-4">
            <fieldset disabled={disabled}>
              <Row className="gy-4">
                <Form.Group controlId="opponent">
                  <Form.Label>Opponent</Form.Label>
                  <Form.Control defaultValue={opponent} type="text" required onChange={e => setOpponent(e.target.value)}/>
                </Form.Group>
                <Form.Group controlId="dateTime">
                  <Form.Label>Kick Off</Form.Label>
                  <Form.Control defaultValue={kickOffDateTime} type="datetime-local" required onChange={e => setKickOffDateTime(e.target.value)}/>
                </Form.Group>
                <Row className="mt-4">
                  <Col xs={6}>
                    <Form.Group controlId="homeGame">
                      <Form.Check defaultChecked={isHomeGame} className="noValidate" label="Home game" name="homeGame" type="radio" required
                                  onChange={() => {
                                    setIsHomeGame(true);
                                    populateHomeAddress();
                                  }}/>
                    </Form.Group>
                    <Form.Group controlId="awayGame">
                      <Form.Check defaultChecked={!isHomeGame} className="noValidate" label="Away game" name="homeGame" type="radio" required
                                  onChange={() => {
                                    setIsHomeGame(false);
                                    clearAddress();
                                  }}/>
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group controlId="homekit">
                      <Form.Check defaultChecked={isHomeKit} className="noValidate" label="Home kit" name="kit" type="radio" required
                                  onChange={() => setIsHomeKit(true)}/>
                    </Form.Group>
                    <Form.Group className="awayKit">
                      <Form.Check defaultChecked={!isHomeKit} className="noValidate" label="Away kit" name="kit" type="radio" required
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
                    <Form.Control value={address2} className="noValidate" type="text"
                                  onChange={e => setAddress2(e.target.value)}/>
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
                      : "Save Changes"}</Button>
                </Form.Group>
              </Row>
            </fieldset>
          </Row>
        </Form>
        <Toast onClose={() => setShowSuccess(false)} show={showSuccess} delay={3000} autohide
               className="position-fixed bottom-0 start-50 translate-middle-x mb-6">
          <div className="d-flex">
            <Toast.Body>Match updated successfully</Toast.Body>
            <CloseButton className="me-2 m-auto" data-bs-dismiss="toast" aria-label="close"/>
          </div>
        </Toast>
        <Toast onClose={() => setShowError(false)} show={showError} delay={6000} autohide
               className="position-fixed bottom-0 start-50 translate-middle-x mb-6">
          <div className="d-flex">
            <Toast.Body>Error updating match: {error?.data?.title}, please try again</Toast.Body>
            <CloseButton className="me-2 m-auto" data-bs-dismiss="toast" aria-label="close"/>
          </div>
        </Toast>
      </>
  );
};

export default EditMatchForm;