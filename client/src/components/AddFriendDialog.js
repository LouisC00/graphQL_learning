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
import { ADD_FRIEND } from "../graphql/queries"; // Import the new query

const AddFriendDialog = ({ open, onClose, addFriendToList }) => {
  const [friendId, setFriendId] = useState("");
  const [getFriend, { data, error }] = useLazyQuery(ADD_FRIEND, {
    onCompleted: (data) => {
      if (data && data.userById) {
        addFriendToList(data.userById);
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
