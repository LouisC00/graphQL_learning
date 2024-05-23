import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { ADD_FRIEND } from "../graphql/queries";
import { addOrUpdateFriend } from "../app/slices/friendsSlice";

const AddFriendDialog = ({ open, onClose }) => {
  const [friendId, setFriendId] = useState("");
  const dispatch = useDispatch();
  const [getFriend, { data, error }] = useLazyQuery(ADD_FRIEND, {
    onCompleted: (data) => {
      if (data && data.addFriend) {
        dispatch(addOrUpdateFriend(data.addFriend));
        setFriendId(""); // Clear the input after fetching
        onClose(); // Close the dialog
      }
    },
    onError: (error) => {
      console.error("Error fetching friend:", error);
    },
  });

  const handleFriendIdChange = (event) => {
    setFriendId(event.target.value);
  };

  const handleSubmit = async () => {
    const friendIdInt = parseInt(friendId);
    if (friendIdInt) {
      getFriend({ variables: { friendId: friendIdInt } });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a Friend</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Friend ID"
          type="number"
          fullWidth
          variant="standard"
          value={friendId}
          onChange={handleFriendIdChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add Friend</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFriendDialog;
