import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {apiSlice} from "../../api/apiSlice";

const matchesAdapter = createEntityAdapter({
  sortComparer: (a, b) => a["kickOffDateTime"] - b["kickOffDateTime"]
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

const selectMatchesData = createSelector(
    selectMatchesResult,
    matchesResult => {
      return matchesResult.data;
    }
);

export const {
  selectAll: selectAllMatches
} = matchesAdapter.getSelectors(state => selectMatchesData(state) ?? initialState);

export const selectResults = createSelector(
    selectAllMatches,
    matches => {
      return matches.filter(match => match["played"]);
    }
);

export const selectFixtures = createSelector(
    selectAllMatches,
    matches => {
      return matches.filter(match => !match["played"]);
    }
);

export const selectNextFixture = createSelector(
    selectFixtures,
    fixtures => fixtures[0]
);

export const selectLastResult = createSelector(
    selectResults,
    results => results[results.length - 1]
);

export const selectFixtureById = (fixtureId) => createSelector(
    selectFixtures,
    fixtures => fixtures.find(fixture => fixture.id === fixtureId)
)

export const selectAvailabilityByUserSub = (userSub) => createSelector(
    selectFixtures,
    fixtures => fixtures.map(({id, kickOffDateTime, address, isHomeGame, isHomeKit, opponent, playerAvailability}) =>
        ({fixture: {id, kickOffDateTime, address, isHomeGame, opponent, isHomeKit}, availability: playerAvailability ? playerAvailability[userSub] : null}))
)

export const selectFixturesGroupedByMonth = createSelector(
    selectFixtures,
    fixtures => groupByMonth(fixtures)
);

export const selectResultsGroupedByMonth = createSelector(
    selectResults,
    results => groupByMonth(results)
);

function groupByMonth(matches) {
  return matches.reduce((group, result) => {
    const month = result["kickOffDateTime"].toLocaleDateString("en-GB", {month: "long"});
    (group[month] = group[month] || []).push(result);

    return group;
  }, {});
}

