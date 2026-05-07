import { LEAVES_URL } from "../../../utils/constants";
import { apiSlice } from "../apiSlice";

export const leaveApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // create leave
    createLeave: builder.mutation({
      query: (data) => ({
        url: `${LEAVES_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Leave"]
    }),

    // admin get all
    getAllLeaves: builder.query({
      query: () => `${LEAVES_URL}`,
      providesTags: ["Leave"],
    }),

    // user get own
    getMyLeaves: builder.query({
      query: () => `${LEAVES_URL}/my`,
      providesTags: ["Leave"],
    }),

    // admin update
    updateLeave: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${LEAVES_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Leave"]
    }),

  }),
});

export const {
  useCreateLeaveMutation,
  useGetAllLeavesQuery,
  useGetMyLeavesQuery,
  useUpdateLeaveMutation,
} = leaveApiSlice;