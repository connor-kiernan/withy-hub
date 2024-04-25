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
      }),
      addEvent: builder.mutation({
        query: addEventRequest => ({
          url: "/addEvent",
          method: "POST",
          body: {...addEventRequest}
        }),
        invalidatesTags: [{type: "Match", id: "LIST"}]
      }),
      editEvent: builder.mutation({
        query: editEventRequest => ({
          url: "/editEvent",
          method: "PATCH",
          body: {...editEventRequest}
        }),
        invalidatesTags: (result, error, arg) => [{type: "Match", id: arg.id}]
      }),
      deleteEvent: builder.mutation({
        query: (eventId) => ({
          url: `/deleteEvent/${eventId}`,
          method: "DELETE"
        }),
        invalidatesTags: [{type: "Match", id: "LIST"}]
      }),
      completeMatch: builder.mutation({
        query: completeMatchRequest => ({
          url: "/completeMatch",
          method: "PATCH",
          body: {...completeMatchRequest}
        }),
        invalidatesTags: (result, error, arg) => [{type: "Match", id: arg.id}]
      })
    };
  }
});

export const {
  useGetMatchesQuery,
  useUpdateAvailabilityMutation,
  useAddEventMutation,
  useEditEventMutation,
  useDeleteEventMutation,
  useCompleteMatchMutation
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

export const selectFutureEvents = createSelector(
    selectAllEvents,
    matches => {
      return matches.filter(match => new Date(match["kickOffDateTime"]) > new Date());
    }
);

export const selectIncompleteMatches = createSelector(
    selectAllEvents,
    events => {
      return events.filter(event => event.eventType === "GAME")
      .filter(event => event?.played === false && new Date() > new Date(event.kickOffDateTime));
    }
);

export const selectEventById = (eventId) => createSelector(
    selectAllEvents,
    events => events.find(event => event.id === eventId)
);

export const selectAvailabilityByUserSub = (userSub) => createSelector(
    selectFutureEvents,
    events => events.map(({id, kickOffDateTime, address, isHomeGame, isHomeKit, opponent, eventType, playerAvailability}) =>
        ({
          event: {id, kickOffDateTime, address, isHomeGame, opponent, isHomeKit, eventType},
          availability: playerAvailability ? playerAvailability[userSub] : null
        }))
);

export const selectEventExists = (newKickOffDateTime) => createSelector(
    selectFutureEvents,
    events => events.some(({kickOffDateTime}) =>
        kickOffDateTime.slice(0, 16) === newKickOffDateTime)
);