import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./slices/language/languageSlice";
import authReducer from "./slices/auth/authSlice";

// import icecreamReducer from "./slices/icecream/icecreamSlice";
// import userReducer from "./slices/user/userSlice";

const store = configureStore({
  reducer: {
    language: languageReducer,
    auth: authReducer,
    // user: userReducer,
  },
});

export default store;
