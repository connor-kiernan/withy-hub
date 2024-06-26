import {apiSlice} from "../../api/apiSlice";
import {logOut, setCredentials} from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: authCodeRequest => ({
        url: "/auth/code",
        method: "POST",
        body: {...authCodeRequest}
      })
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST"
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled}) {
        try {
          await queryFulfilled;
          dispatch(logOut())
          dispatch(apiSlice.util.resetApiState())
        } catch (err) {
          console.log(err);
        }
      }
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET"
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          dispatch(setCredentials({...data}))
        } catch (err) {
          console.error(err)
        }
      }
    })
  })
})

export const {
  useLoginMutation,
  useSendLogoutMutation,
  useRefreshMutation
} = authApiSlice