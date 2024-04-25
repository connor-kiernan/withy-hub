import React, {useEffect, useState} from "react";
import {Button, CloseButton, Form, Row, Spinner, Toast} from "react-bootstrap";
import {selectEventExists, useAddEventMutation} from "../../features/matches/matchSlice";
import {useSelector} from "react-redux";

const AddOtherEventForm = () => {
  const date = new Date().toISOString().split("T")[0] + "T00:00";
  const [eventName, setEventName] = useState("");
  const [kickOffDateTime, setKickOffDateTime] = useState(date);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [postcode, setPostcode] = useState("");

  const [validated, setValidated] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [addEvent, {isLoading, isSuccess, isError, error}] = useAddEventMutation();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [customError, setCustomError] = useState("");
  const eventExists = useSelector(selectEventExists(kickOffDateTime));

  const submitForm = async (e) => {
    setDisabled(true);
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;

    if (form.checkValidity() !== false) {
      setValidated(false);

      if (eventExists) {
        setCustomError("Event already exists at that time");
        setShowError(true);
      } else {
        await addEvent({
          opponent: eventName,
          kickOffDateTime,
          address1,
          address2,
          postcode,
          eventType: "OTHER"
        })
      }
    } else {
      setValidated(true);
    }

    setDisabled(false);
  };

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      setEventName("")
      setAddress1("");
      setAddress2("");
      setPostcode("");
      document.getElementById("addOtherEventForm").reset();
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
        <Form noValidate onSubmit={submitForm} validated={validated} id="addOtherEventForm">
          <Row className="mb-4">
            <fieldset disabled={disabled}>
              <Row className="gy-4">
                <Form.Group controlId="eventName">
                  <Form.Label>Event Name</Form.Label>
                  <Form.Control defaultValue="" type="text" required onChange={e => setEventName(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId="dateTime">
                  <Form.Label>Event Date</Form.Label>
                  <Form.Control type="datetime-local" min={date} required
                                onChange={e => setKickOffDateTime(e.target.value)}/>
                </Form.Group>
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
                </fieldset>

                <Form.Group className="text-center">
                  <Button type="submit">{isLoading ? (
                          <Spinner as="span" animation="border" role="status" variant="secondary">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>)
                      : "Add Event"}</Button>
                </Form.Group>
              </Row>
            </fieldset>
          </Row>
        </Form>
        <Toast onClose={() => setShowSuccess(false)} show={showSuccess} delay={3000} autohide
               className="position-fixed bottom-0 start-50 translate-middle-x mb-6">
          <div className="d-flex">
            <Toast.Body>Event added successfully</Toast.Body>
            <CloseButton className="me-2 m-auto" data-bs-dismiss="toast" aria-label="close"/>
          </div>
        </Toast>
        <Toast onClose={() => setShowError(false)} show={showError} delay={6000} autohide
               className="position-fixed bottom-0 start-50 translate-middle-x mb-6">
          <div className="d-flex">
            <Toast.Body>Error adding event: {error?.data?.title ?? customError}, please try again</Toast.Body>
            <CloseButton className="me-2 m-auto" data-bs-dismiss="toast" aria-label="close"/>
          </div>
        </Toast>
      </>
  );
};

export default AddOtherEventForm;