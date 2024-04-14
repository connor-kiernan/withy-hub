import React, {useEffect, useRef, useState} from "react";
import {Button, CloseButton, FloatingLabel, Form, InputGroup, Row, Spinner, Toast} from "react-bootstrap";
import AnimateHeight from "react-animate-height";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../features/auth/authSlice";
import {resolveAvailabilityVariant} from "./AvailabilityCard";
import {useUpdateAvailabilityMutation} from "../../features/matches/matchSlice";

const AvailabilityForm = ({playerAvailability, matchId}) => {
  const userSub = useSelector(selectCurrentUser);
  const userAvailability = playerAvailability[userSub];
  const [status, setStatus] = useState(userAvailability?.status ?? "");
  const [comment, setComment] = useState(userAvailability?.comment ?? "");
  const [textClass, setTextClass] = useState("bg-" + (userAvailability ? resolveAvailabilityVariant(userAvailability.status) : "secondary"));
  const [height, setHeight] = useState(userAvailability?.status !== "FAN_CLUB" ? "auto" : 0);
  const [validated, setValidated] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [updateAvailability, {isLoading, isSuccess, isError}] = useUpdateAvailabilityMutation();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const confirmedAvailability = useRef(userAvailability?.status);
  const confirmedComment = useRef(userAvailability?.comment);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  useEffect(() => {
    if (status !== confirmedAvailability.current || comment.trim() !== confirmedComment.current) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [status, comment]);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      confirmedAvailability.current = status;
      confirmedComment.current = comment;
      setSubmitDisabled(true);
    }
    // eslint-disable-next-line
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setShowError(true);
    }
  }, [isError]);

  function updateStatus(e) {
    const value = e.target.value;
    setStatus(value);
    setTextClass("bg-" + resolveAvailabilityVariant(value));
    setComment("");

    setHeight(value !== "FAN_CLUB" ? "auto" : 0);
  }

  const submitForm = async (e) => {
    setDisabled(true);
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;

    if (form.checkValidity() !== false) {
      setValidated(false);

      await updateAvailability({userSub, matchId, availability: {status, comment: comment.trim()}});
    } else {
      setValidated(true);
    }

    setDisabled(false);
  };

  return (
      <>
        <Form noValidate onSubmit={submitForm} validated={validated}>
          <fieldset disabled={disabled}>
            <Row className="gy-3">
              <Form.Group controlId="availabilitySelect">
                <InputGroup>
                  <Form.Select defaultValue={status} aria-label="Availability Selector" onChange={e => updateStatus(e)}
                               required>
                    <option value="" disabled>Set Availability</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="IF_DESPERATE">If desperate</option>
                    <option value="UNAVAILABLE">Unavailable</option>
                    <option value="FAN_CLUB">Fan club</option>
                  </Form.Select>
                  <InputGroup.Text className={textClass}>
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <AnimateHeight height={height}>
                <Form.Group>
                  <FloatingLabel controlId="comment" label="Comment (optional)">
                    <Form.Control className="no-validate" autoComplete="off" value={comment} size="sm" type="text"
                                  placeholder="Comment" onChange={e => setComment(e.target.value)}/>
                  </FloatingLabel>
                </Form.Group>
              </AnimateHeight>
              <Form.Group className="text-center">
                <Button type="submit" variant="primary" disabled={submitDisabled}>
                  {isLoading ? (
                          <Spinner as="span" animation="border" role="status" variant="secondary">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>)
                      : "Confirm Availability"}</Button>
              </Form.Group>
            </Row>
          </fieldset>
        </Form>
        <Toast onClose={() => setShowSuccess(false)} show={showSuccess} delay={3000} autohide
               className="position-fixed bottom-0 start-50 translate-middle-x mb-6">
          <div className="d-flex">
            <Toast.Body>Availability updated successfully</Toast.Body>
            <CloseButton className="me-2 m-auto" data-bs-dismiss="toast" aria-label="close"/>
          </div>
        </Toast>
        <Toast onClose={() => setShowError(false)} show={showError} delay={3000} autohide
               className="position-fixed bottom-0 start-50 translate-middle-x mb-6">
          <div className="d-flex">
            <Toast.Body>Error updating availability, please try again</Toast.Body>
            <CloseButton className="me-2 m-auto" data-bs-dismiss="toast" aria-label="close"/>
          </div>
        </Toast>
      </>
  );
};

export default AvailabilityForm;