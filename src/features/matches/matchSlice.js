import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {apiSlice} from "../../api/apiSlice";

const matchesAdapter = createEntityAdapter({
  sortComparer: (a, b) => Date.parse(a["kickOffDateTime"]) - Date.parse(b["kickOffDateTime"])
});

const initialState = matchesAdapter.getInitialState({});

export const matchesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => {
    return {
      getMatches: builder.query({
        query: () => "/matchesForAvailability",
        transformResponse: responseData => {
          return matchesAdapter.setAll(initialState, responseData);
        },
        providesTags: (result) => {
          if (result?.ids) {
            return [{type: "Match", id: "LIST"}, ...result.ids.map(id => ({type: "Match", id: id}))];
          }
          return [{type: "Match", id: "LIST"}];
        }
      }),
      updateAvailability: builder.mutation({
        query: availabilityUpdateRequest => ({
          url: "/availability",
          method: "PATCH",
          body: {...availabilityUpdateRequest}
        }),
        invalidatesTags: (result, error, arg) => [{type: "Match", id: arg.id}]
      })
    };
  }
});

export const {
  useGetMatchesQuery,
  useUpdateAvailabilityMutation,
} = matchesApiSlice;

export const selectMatchesResult = matchesApiSlice.endpoints.getMatches.select();

const selectEventsData = createSelector(
    selectMatchesResult,
    matchesResult => {
      return matchesResult.data;
    }
);

export const {
  selectAll: selectAllEvents
} = matchesAdapter.getSelectors(state => selectEventsData(state) ?? initialState);

export const selectResults = createSelector(
    selectAllEvents,
    matches => {
      return matches.filter(match => match["played"] ?? match["kickOffDateTime"] > new Date() / 1000);
    }
);

export const selectFutureEvents = createSelector(
    selectAllEvents,
    matches => {
      return matches.filter(match => !match["played"]);
    }
);

export const selectNextEvent = createSelector(
    selectFutureEvents,
    events => events[0]
);

export const selectLastResult = createSelector(
    selectResults,
    results => results[results.length - 1]
);

export const selectEventById = (eventId) => createSelector(
    selectFutureEvents,
    events => events.find(event => event.id === eventId)
)

export const selectAvailabilityByUserSub = (userSub) => createSelector(
    selectFutureEvents,
    event => event.map(({id, kickOffDateTime, address, isHomeGame, isHomeKit, opponent, eventType, playerAvailability}) =>
        ({event: {id, kickOffDateTime, address, isHomeGame, opponent, isHomeKit, eventType}, availability: playerAvailability ? playerAvailability[userSub] : null}))
)
