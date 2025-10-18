import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from 'react-redux'

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: any, action: any) => {
      state.user = action.payload;
    },
    clearUser: (state: any) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

export const useUser = () => useSelector((state: any) => state.user)?.user || null
