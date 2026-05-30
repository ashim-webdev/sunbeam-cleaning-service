import { USERS_URL } from "../../../utils/constants";
import { apiSlice } from "../apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (formData) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: ["User", "TeamList", "Notification"],
    }),

    getUserProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    getTeamLists: builder.query({
      query: ({ page = 1, limit = 10, search = "", type="" }) => ({
        url: `${USERS_URL}/get-team`,
        method: "GET",
        credentials: "include",
        params: {
          page,
          limit,
          search,
          type,
        },
      }),

      providesTags: ["User", "TeamList"],
    }),

    getUserTaskStatus: builder.query({
      query: () => ({
        url: `${USERS_URL}/get-status`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getNotifications: builder.query({
      query: () => ({
        url: `${USERS_URL}/notifications`,
        method: "GET",
        credentials: "include",
      }),

      providesTags: ["User", "Notification"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["User", "TeamList", "Dashboard"],
    }),

    userAction: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data?.id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User", "TeamList", "Dashboard"],
    }),

    markNotiAsRead: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/read-noti`,
        method: "PUT",
        body: {
          isReadType: data.isReadType,
          id: data?.id,
        },
        credentials: "include",
      }),
      invalidatesTags: ["User", "Notification"],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/change-password`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useGetUserProfileQuery,
  useGetTeamListsQuery,
  useDeleteUserMutation,
  useUserActionMutation,
  useChangePasswordMutation,
  useGetNotificationsQuery,
  useMarkNotiAsReadMutation,
  useGetUserTaskStatusQuery,
} = userApiSlice;
