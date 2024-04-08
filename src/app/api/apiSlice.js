import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {logOut, setCredentials} from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_HAPI_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }

    return headers;
  }
})

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.originalStatus === 401) {
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if(refreshResult?.data) {
      api.dispatch(setCredentials(refreshResult.data.accessToken))

      result = await baseQueryWithReAuth(args, api, extraOptions)
    } else {
      api.dispatch(logOut())
    }
  }

  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: builder => ({})
})