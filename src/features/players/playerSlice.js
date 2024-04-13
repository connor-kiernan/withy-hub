import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {apiSlice} from "../../api/apiSlice";

const playersAdapter = createEntityAdapter({
  selectId: player => player["username"],
  sortComparer: (a, b) => {
    if (a["position"]["positionGroup"] === "STAFF") {
      return -1;
    }

    if (b["position"]["positionGroup"] === "STAFF") {
      return 1;
    }

    return (a["kitNumber"] || 100) - (b["kitNumber"] || 100);
  }
});

const initialState = playersAdapter.getInitialState({});

export const playerApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPlayers: builder.query({
      query: () => "/players",
      transformResponse: responseData => playersAdapter.setAll(initialState, responseData),
      providesTags: {type: "Player", id: "LIST"}
    })
  })
});

export const {
  useGetPlayersQuery
} = playerApiSlice;

export const selectPlayersResult = playerApiSlice.endpoints.getPlayers.select();

const selectPlayersData = createSelector(
    selectPlayersResult,
    playersResult => {
      return playersResult.data
    }
);

export const {
  selectAll: selectAllPlayers
} = playersAdapter.getSelectors(state => selectPlayersData(state) ?? initialState);
