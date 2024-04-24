import React from "react";
import {useParams} from "react-router-dom";
import {selectEventById} from "../../features/matches/matchSlice";
import EditMatchForm from "./EditMatchForm";
import {useSelector} from "react-redux";
import EditTrainingForm from "./EditTrainingForm";
import EditOtherEventForm from "./EditOtherEventForm";

const EditEventForm = () => {
  const {eventId} = useParams();
  const event = useSelector(selectEventById(eventId));

  if (event?.eventType === "GAME") {
    return <EditMatchForm match={event}/>
  }

  if (event?.eventType === "TRAINING") {
    return <EditTrainingForm training={event} />
  }

  return <EditOtherEventForm event={event} />;
};

export default EditEventForm;