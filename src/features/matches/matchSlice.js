import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {apiSlice} from "../../api/apiSlice";

const matchesAdapter = createEntityAdapter({
  sortComparer: (a, b) => a["kickOffDateTime"] - b["kickOffDateTime"]
});

const initialState = matchesAdapter.getInitialState({});

export const matchesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMatches: builder.query({
      query: () => "/matchesForAvailability",
      transformResponse: responseData => {
        responseData.map(match => match["kickOffDateTime"] = new Date(match["kickOffDateTime"]));

        return matchesAdapter.setAll(initialState, responseData);
      },
      providesTags: {type: "Match", id: "LIST"}
    })
  })
});

export const {
  useGetMatchesQuery
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
    fixtures => fixtures.filter(fixture => fixture.id === fixtureId)
)

export const selectAvailabilityByUsername = (username) => createSelector(
    selectFixtures,
    fixtures => fixtures.map(({id, kickOffDateTime, address, isHomeGame, isHomeKit, opponent, playerAvailability}) =>
        ({fixture: {id, kickOffDateTime, address, isHomeGame, opponent, isHomeKit}, availability: playerAvailability[username]}))
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

