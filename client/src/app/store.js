import { configureStore } from "@reduxjs/toolkit";
import friendsReducer from "./slices/friendsSlice";

const store = configureStore({
  reducer: {
    friends: friendsReducer,
  },
});

export default store;
