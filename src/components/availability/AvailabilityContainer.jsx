import React from "react";
import LoadingScreen from "../LoadingScreen";
import {matchesApiSlice, useGetMatchesQuery} from "../../features/matches/matchSlice";
import {Outlet} from "react-router-dom";
import {store} from "../../app/store";

store.dispatch(matchesApiSlice.endpoints.getMatches.initiate());

const AvailabilityContainer = () => {
  const {
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetMatchesQuery();

  let renderedContainer;
  if (isLoading) {
    renderedContainer = <LoadingScreen />
  } else if (isSuccess) {
    renderedContainer = <Outlet />;
  } else if (isError) {
    renderedContainer = <p>Unknown error when fetching matches: {JSON.stringify(error)}</p>;
  }

  return (renderedContainer);
};

export default AvailabilityContainer;