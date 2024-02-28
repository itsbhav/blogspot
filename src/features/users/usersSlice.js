import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { logOut } from "../auth/authSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsersById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        // body: { ...initialData },
        params:{id},
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedUser = { ...responseData, id:responseData._id };
        
        return usersAdapter.setOne(initialState, loadedUser);
      },
      providesTags: (result, error, arg) => {
        
        if (result?.ids) {
          return [
            { type: "Users", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Users", id })),
          ];
        } else return [{ type: "Users", id: "LIST" }];
      },
    }),
    getUsersBySearch: builder.query({
      query: (searchData) => ({
        url: `/users/other/${searchData}`,
        params:{searchInput:searchData},
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Users", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Users", id })),
          ];
        } else return [{ type: "Users", id: "LIST" }];
      },
    }),
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users/create",
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),
      providesTags: [{ type: "Users", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "PATCH",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    deleteUser: builder.mutation({
      query: () => ({
        url: `/users`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          
          dispatch(logOut());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    friendReq: builder.mutation({
      query: (id) => ({
        url: "/users/friend",
        method: "PATCH",
        body: {
          reqToId:id
        },
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    acceptReq: builder.mutation({
      query: (data) => ({
        url: "/users/accept",
        method: "PATCH",
        body: {
          reqToId: data.id,
          accepted:data.accept
        },
      }),
      invalidatesTags: [
        { type: "Users", id: "LIST" },
      ],
    }),
    getRecommendations: builder.query({
      query: () => ({
        url: "/users/recommend",
       validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Users", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Users", id })),
          ];
        } else return [{ type: "Users", id: "LIST" }];
      },
    })
  }),
});

export const {
  useGetUsersByIdQuery,
  useGetUsersBySearchQuery,
  useGetRecommendationsQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useFriendReqMutation,
  useAcceptReqMutation,
} = usersApiSlice;

// returns the query result object
// export const selectUsersResult = usersApiSlice.endpoints.getFriendUsers.select();

// creates memoized selector
// const selectUsersData = createSelector(
//   selectUsersResult,
//   (usersResult) => usersResult.data // normalized state object with ids & entities
// );

//getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
//   selectAll: selectAllUsers,
//   selectById: selectUserById,
//   selectIds: selectUserIds,
//   // Pass in a selector that returns the users slice of state
// } = usersAdapter.getSelectors(
//   (state) => selectUsersData(state) ?? initialState
// );
