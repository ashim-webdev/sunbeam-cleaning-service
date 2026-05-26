import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null,

  isSidebarOpen: false,
  isProfileOpen: false,
  LightMode: JSON.parse(localStorage.getItem("lightMode")) ?? true,
  MiniMenu: true,
  selectedUserId: null,
  selectedUserInfo: null,
  userViewInfo: null,
  CPEditPopUp: false,
  onlineUsers: [],
  taskNotifications: 0,
  leaveNotifications: 0,
};


const authSlice = createSlice ({
    name: "auth",
    initialState,
  reducers : {
    setCredentials : (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload))
    },

    logout: (state, action) => {
      state.user = null;
      localStorage.removeItem("userInfo");
    },

    setOpenSidebar : (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    
    setOpenProfile : (state, action) => {
      state.isProfileOpen = action.payload;
    },

    setLightMode: (state) => {
      state.LightMode = !state.LightMode;
      localStorage.setItem("lightMode", JSON.stringify(state.LightMode));
    },

    setMiniMenu : (state, action) => {
      state.MiniMenu = action.payload;
    },

    setCPEditPopUp : (state, action) => {
      state.CPEditPopUp = action.payload;
    },

    setSelectUserDashInfo: (state, action) => {
      state.selectedUserId = action.payload._id;
      state.selectedUserInfo = action.payload;
    },

    setUserViewInfo: (state, action) => {
      state.userViewInfo = action.payload;
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    incrementTaskNotifications: (state) => {
      state.taskNotifications += 1;
    },

    clearTaskNotifications: (state) => {
      state.taskNotifications = 0;
    },

    incrementLeaveNotifications: (state) => {
      state.leaveNotifications += 1;
    },

    clearLeaveNotifications: (state) => {
      state.leaveNotifications = 0;
    },
  },
})


export const { 
  setCredentials,
  logout,
  setOpenSidebar, 
  setOpenProfile, 
  setLightMode, 
  setMiniMenu, 
  setSelectUserDashInfo, 
  setCPEditPopUp,
  setUserViewInfo,
  setOnlineUsers,
  incrementTaskNotifications,
  clearTaskNotifications,
  incrementLeaveNotifications,
  clearLeaveNotifications,
} = authSlice.actions

export default authSlice.reducer