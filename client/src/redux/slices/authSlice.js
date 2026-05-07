import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null,

  isSidebarOpen: false,
  isProfileOpen: false,
  LightMode: JSON.parse(localStorage.getItem("lightMode")) ?? true,
  MiniMenu: true,
  SelectUserDashInfo: null,
  CPEditPopUp: false
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

    setSelectUserDashInfo : (state, action) => {
      state.SelectUserDashInfo = action.payload;
    }
  },
})


export const { setCredentials, logout, setOpenSidebar, setOpenProfile, setLightMode, setMiniMenu, setSelectUserDashInfo, setCPEditPopUp } = authSlice.actions

export default authSlice.reducer