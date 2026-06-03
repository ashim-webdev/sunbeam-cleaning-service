import { apiSlice } from "../apiSlice";
import { BOOKINGS_URL } from "../../../utils/constants";

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (data) => ({
        url: `${BOOKINGS_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    updateBooking: builder.mutation({
      query: ({ bookingId, ...data }) => ({
        url: `${BOOKINGS_URL}/${bookingId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Booking"],
    }),

    getBookings: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
      }) =>
        `${BOOKINGS_URL}?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`,
      providesTags: ["Booking"],
    }),

    getBookingById: builder.query({
      query: (id) => `${BOOKINGS_URL}/${id}`,
    }),

    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${BOOKINGS_URL}/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Booking"],
    }),

    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `${BOOKINGS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useUpdateBookingStatusMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingApiSlice;