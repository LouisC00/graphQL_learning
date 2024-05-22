import { createSlice } from "@reduxjs/toolkit";

const friendsSlice = createSlice({
  name: "friends",
  initialState: [],
  reducers: {
    setFriends: (state, action) => {
      return action.payload;
    },
    addOrUpdateFriend: (state, action) => {
      const friend = action.payload;
      const existingFriendIndex = state.findIndex((f) => f.id === friend.id);
      if (existingFriendIndex > -1) {
        // Update existing friend and move to top
        state.splice(existingFriendIndex, 1);
      }
      state.unshift(friend);
    },
  },
});

export const { setFriends, addOrUpdateFriend } = friendsSlice.actions;
export default friendsSlice.reducer;
