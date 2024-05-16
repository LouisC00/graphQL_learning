import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_USER_STATUS } from "../graphql/mutations";
import { GET_CURRENT_USER_STATUS } from "../graphql/queries";

const StatusDialog = ({ open, onClose }) => {
  const [status, setStatus] = useState("");
  const {
    data,
    loading,
    error: queryError,
  } = useQuery(GET_CURRENT_USER_STATUS, {
    skip: !open, // Only run the query when the dialog is open
    fetchPolicy: "cache-only", // Use cache for subsequent executions
  });

  useEffect(() => {
    if (data && data.getCurrentUserStatus) {
      setStatus(data.getCurrentUserStatus.status || "");
    }
  }, [data]);

  const [updateStatus, { error: mutationError }] = useMutation(
    UPDATE_USER_STATUS,
    {
      update: (cache, { data }) => {
        // Assuming the mutation returns the updated user object
        if (data.updateUserStatus) {
          cache.writeQuery({
            query: GET_CURRENT_USER_STATUS,
            data: { getCurrentUserStatus: data.updateUserStatus },
          });
        }
      },
      onCompleted: () => {
        setStatus(""); // Clear the input after updating
        onClose(); // Close the dialog
      },
    }
  );

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSubmit = async () => {
    if (status.trim()) {
      await updateStatus({ variables: { status } });
      setStatus(""); // Clear status input after submission
      onClose(); // Close the dialog
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Your Status</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Status"
          type="text"
          fullWidth
          variant="standard"
          value={status}
          onChange={handleStatusChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusDialog;
