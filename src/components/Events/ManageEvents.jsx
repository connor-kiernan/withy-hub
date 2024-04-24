import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectEventById, selectFutureEvents, useDeleteEventMutation} from "../../features/matches/matchSlice";
import {Alert, Button, Card, CloseButton, Modal, Spinner, Stack, Table, Toast} from "react-bootstrap";
import {Link} from "react-router-dom";

const ManageEvents = () => {
  const events = useSelector(selectFutureEvents);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const eventForDeletion = useSelector(selectEventById(deleteId));

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [submitDisabled, setSubmitDisabled] = useState(false);

  const [deleteEvent, {
    isLoading,
    isSuccess,
    isError
  }] = useDeleteEventMutation();

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      setSubmitDisabled(false);
      handleClose()
    }
    // eslint-disable-next-line
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setShowError(true);
    }
  }, [isError]);

  useEffect(() => {
    if (isLoading) {
      setSubmitDisabled(true);
    }
  }, [isLoading]);

  const submitDeleteEvent = async () => {
    await deleteEvent(deleteId)
  }

  const formatDate = (dateString) => {
    const localeString = new Date(dateString).toLocaleString();
    return localeString.substring(0, localeString.lastIndexOf(":"));
  };

  const handleShow = (eventId) => {
    setShowDeleteModal(true);
    setDeleteId(eventId);
  };

  const handleClose = () => setShowDeleteModal(false);

  return (
      <>
        <Table bordered responsive className="border-secondary">
          <tbody>
          {events.map(event =>
              <tr key={event.id}>
                <td className="align-middle">
                  <Stack>
                    <div className="fs-5">{event.opponent}</div>
                    <div className="text-secondary">{formatDate(event.kickOffDateTime)}</div>
                  </Stack>
                </td>
                <td className="align-middle text-center">
                  {event.eventType === "GAME" && new Date(event.kickOffDateTime) < new Date() ?
                      <Button variant="success">Complete</Button> :
                      <div className="d-grid">
                        <Link to={event.id}>
                          <Button variant="info"><i className="fa-solid fa-pen-to-square"></i></Button>
                        </Link>
                      </div>
                  }
                </td>
                <td className="align-middle text-center">
                  <Button variant="danger" onClick={() => handleShow(event.id)}><i
                      className="fa-solid fa-trash"></i></Button>
                </td>
              </tr>)
          }
          </tbody>
        </Table>
        <Modal show={showDeleteModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Event Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-0">
            Are you sure you want to delete the following {eventForDeletion?.eventType === "OTHER" ? "event"
              : eventForDeletion?.eventType.toLowerCase()}?
            <Card className="mt-1">
              <Card.Body>
                <Card.Title>{eventForDeletion?.opponent}</Card.Title>
                <Card.Text>{formatDate(eventForDeletion?.kickOffDateTime)}</Card.Text>
              </Card.Body>
            </Card>
            <Alert variant="danger" className="py-1 px-3 mt-2">
              <i className="fa-solid fa-triangle-exclamation"></i> This can not be undone
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => submitDeleteEvent()} disabled={submitDisabled}>
              {isLoading ? (
                      <Spinner as="span" animation="border" role="status" variant="secondary">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>)
                  : "Delete"}
            </Button>
          </Modal.Footer>
        </Modal>
        <Toast onClose={() => setShowSuccess(false)} show={showSuccess} delay={3000} autohide
               className="position-fixed bottom-0 start-50 translate-middle-x mb-6">
          <div className="d-flex">
            <Toast.Body>Event deleted successfully</Toast.Body>
            <CloseButton className="me-2 m-auto" data-bs-dismiss="toast" aria-label="close"/>
          </div>
        </Toast>
        <Toast onClose={() => setShowError(false)} show={showError} delay={3000} autohide
               className="position-fixed bottom-0 start-50 translate-middle-x mb-6">
          <div className="d-flex">
            <Toast.Body>Error deleting event, please try again</Toast.Body>
            <CloseButton className="me-2 m-auto" data-bs-dismiss="toast" aria-label="close"/>
          </div>
        </Toast>
      </>
  );
};

export default ManageEvents;