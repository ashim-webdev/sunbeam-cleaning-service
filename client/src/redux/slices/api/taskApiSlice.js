import { TASKS_URL } from "../../../utils/constants";
import { apiSlice } from "../apiSlice";

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `${TASKS_URL}/dashboard`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),

      providesTags: ["Dashboard", "User", "TeamList"],
    }),

    createTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),

      invalidatesTags: [{ type: "Task", id: "LIST" }, "Dashboard"]
    }),

    duplicateTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/duplicate/${id}`,
        method: "POST",
        body: {},
        credentials: "include",
      }),

      invalidatesTags: [{ type: "Task", id: "LIST" }, "Dashboard"]
    }),

    updateTask: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${TASKS_URL}/update/${id}`,
        method: "PUT",
        body: formData,
        credentials: "include",
      }),

      invalidatesTags: [{ type: "Task", id: "LIST" }, "Dashboard"]
    }),

    getAllTask: builder.query({
      query: ({
        strQuery,
        isTrashed,
        search,
        page = 1,
        limit = 10,
      }) => ({
        url: TASKS_URL,
        method: "GET",
        params: {
          stage: strQuery,
          isTrashed,
          search,
          page,
          limit,
        },
        credentials: "include",
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.tasks.map(({ _id }) => ({
                type: "Task",
                id: _id,
              })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),

    getSingleTask: builder.query({
      query: (id) => ({
        url: `${TASKS_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),

      providesTags: ["Task"]
    }),

    createSubTask: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASKS_URL}/create-subtask/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),

      invalidatesTags: [{ type: "Task", id: "LIST" }, "Dashboard"]
    }),

    postTaskActivity: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASKS_URL}/activity/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),

      invalidatesTags: ["Task"],
    }),

    trashTask: builder.mutation({
      query: ({ id }) => ({
        url: `${TASKS_URL}/${id}`,
        method: "PUT",
        credentials: "include",
      }),

      invalidatesTags: [{ type: "Task", id: "LIST" }, "Dashboard"]
    }),

    deleteRestoreTask: builder.mutation({
      query: ({ id, actionType }) => ({
        url: id
          ? `${TASKS_URL}/delete-restore/${id}?actionType=${actionType}`
          : `${TASKS_URL}/delete-restore?actionType=${actionType}`,

        method: "DELETE",
        credentials: "include",
      }),

      invalidatesTags: [{ type: "Task", id: "LIST" }, "Dashboard"],
    }),

    changeTaskStage: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/change-stage/${data?.id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),

      invalidatesTags: [{ type: "Task", id: "LIST" }, "Dashboard"],
    }),

    changeSubTaskStatus: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/change-status/${data?.taskId}/${data?.subTaskId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),

      invalidatesTags: [{ type: "Task", id: "LIST" }, "Dashboard"]
    }),

    deleteTaskActivity: builder.mutation({
      query: ({ taskId, activityId }) => ({
        url: `/task/activity/${taskId}/${activityId}`,
        method: "DELETE",
      }),

      invalidatesTags:  [{ type: "Task", id: "LIST" }, "Dashboard"]
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  usePostTaskActivityMutation,
  useCreateTaskMutation,
  useGetAllTaskQuery,
  useCreateSubTaskMutation,
  useTrashTaskMutation,
  useDeleteRestoreTaskMutation,
  useDuplicateTaskMutation,
  useUpdateTaskMutation,
  useGetSingleTaskQuery,
  useChangeTaskStageMutation,
  useChangeSubTaskStatusMutation,
  useDeleteTaskActivityMutation
} = postApiSlice;
