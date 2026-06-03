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
      query: (page = 1) => ({
        url: `${LEAVES_URL}?page=${page}`,
      }),
      providesTags: ["Leave"],
    }),

    // user get own
    getMyLeaves: builder.query({
      query: (page = 1) => ({
        url: `${LEAVES_URL}/my?page=${page}`,
      }),
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

    // get user leave request by user id
    getLeavesByUser: builder.query({
      query: ({ id, page = 1, limit = 5 }) => ({
        url: `${LEAVES_URL}/user/${id}?page=${page}&limit=${limit}`,
      }),
      providesTags: ["Leave"],
    }),

  }),
});

export const {
  useCreateLeaveMutation,
  useGetAllLeavesQuery,
  useGetMyLeavesQuery,
  useUpdateLeaveMutation,
  useGetLeavesByUserQuery
} = leaveApiSlice;