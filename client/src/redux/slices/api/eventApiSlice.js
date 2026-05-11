import { EVENTS_URL } from "../../../utils/constants";
import { apiSlice } from "../apiSlice";


export const eventApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // GET EVENTS
    getEvents: builder.query({
      query: () => ({
        url: `${EVENTS_URL}`,
      }),
      providesTags: ["Events"],
    }),

    // CREATE EVENT
    createEvent: builder.mutation({
      query: (data) => ({
        url: `${EVENTS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Events"],
    }),

    // UPDATE EVENT
    updateEvent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${EVENTS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Events"],
    }),

    // DELETE EVENT
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `${EVENTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),

  }),
});

export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApiSlice;