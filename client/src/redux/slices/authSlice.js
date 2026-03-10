import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null,

  isSidebarOpen: false,
  LightMode: true,
  MiniMenu: false
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

    setLightMode : (state, action) => {
      state.LightMode = !state.LightMode;
    },

    setMiniMenu : (state, action) => {
      state.MiniMenu = !state.MiniMenu;
    }
  },
})


export const { setCredentials, logout, setOpenSidebar, setLightMode, setMiniMenu } = authSlice.actions

export default authSlice.reducer