import React, {useState} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";

const AddMatchForm = () => {
  const date = new Date().toISOString().split("T")[0] + "T10:15";
  const [validated, setValidated] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [opponent, setOpponent] = useState("");
  const [kickOffTime, setKickOffTime] = useState(date);
  const [isHomeGame, setIsHomeGame] = useState(true);
  const [isHomeKit, setIsHomeKit] = useState(true);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [postcode, setPostcode] = useState("");
  const [pitchType, setPitchType] = useState("GRASS");

  const submitForm = async (e) => {
    setDisabled(true);
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;

    if (form.checkValidity() !== false) {
      setValidated(false);
      form.reset();
    } else {
      setValidated(true);
    }

    setDisabled(false);
  };

  return (
      <Form noValidate onSubmit={submitForm} validated={validated}>
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
                              onChange={e => setKickOffTime(e.target.value)}/>
              </Form.Group>
              <Row className="mt-4">
                <Col xs={6}>
                  <Form.Group controlId="homeGame">
                    <Form.Check className="noValidate" label="Home game" name="homeGame" type="radio" required
                                onChange={() => setIsHomeGame(true)}/>
                  </Form.Group>
                  <Form.Group controlId="awayGame">
                    <Form.Check className="noValidate" label="Away game" name="homeGame" type="radio" required
                                onChange={() => setIsHomeGame(false)}/>
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
              <fieldset className="mt-4 mb-2">
                <legend>Address</legend>
                <Form.Group className="mb-2" controlId="address1">
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control type="text" required onChange={e => setAddress1(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-2" controlId="address2">
                  <Form.Label>Address Line 2 (Optional)</Form.Label>
                  <Form.Control className="noValidate" type="text" onChange={e => setAddress2(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-2" controlId="postcode">
                  <Form.Label>Postcode</Form.Label>
                  <Form.Control type="text" required pattern="^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$"
                                onChange={e => setPostcode(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-2" controlId="pitchType">
                  <Form.Label>Pitch Type</Form.Label>
                  <Form.Select required onChange={e => setPitchType(e.target.value)}>
                    <option value="GRASS">Grass</option>
                    <option value="ASTRO">Astro Turf</option>
                  </Form.Select>
                </Form.Group>
              </fieldset>

              <Form.Group className="text-center">
                <Button type="submit">Add Match</Button>
              </Form.Group>
            </Row>
          </fieldset>
        </Row>
      </Form>
  );
};

export default AddMatchForm;