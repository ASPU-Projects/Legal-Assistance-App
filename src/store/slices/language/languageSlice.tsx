import { createSlice } from "@reduxjs/toolkit";
import i18next from "i18next";

const initialState = {
  language: localStorage.getItem("i18nextLng") || "ar",
};

const languageReducer = createSlice({
  name: "language",
  initialState,
  reducers: {
    changeLanguage: (state, action) => {
      state.language = action.payload;
      i18next.changeLanguage(action.payload);
    },
  },
});

export default languageReducer.reducer;
export const { changeLanguage } = languageReducer.actions;
