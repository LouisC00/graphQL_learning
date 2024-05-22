import React, { useState } from "react";
import { Box, Typography, Divider, Stack, IconButton } from "@mui/material";
import UserCard from "./UserCard";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useQuery } from "@apollo/client";
import { GET_FRIENDS_FROM_MESSAGES } from "../graphql/queries"; // Import the new query
import StatusDialog from "./StatusDialog";
import AddFriendDialog from "./AddFriendDialog"; // Import the AddFriendDialog component

const SideBar = ({ setLoggedIn }) => {
  const { loading, data, error } = useQuery(GET_FRIENDS_FROM_MESSAGES);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false); // State for AddFriendDialog

  if (loading) return <Typography variant="h6">Loading friends...</Typography>;
  if (error) {
    console.log(error.message);
    return <Typography variant="h6">Error loading friends!</Typography>;
  }

  return (
    <Box backgroundColor="#f7f7f7" height="100vh" width="250px" padding="0.8vw">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Friends</Typography>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => setStatusDialogOpen(true)}>
            <SettingsIcon />
          </IconButton>
          <IconButton onClick={() => setAddFriendDialogOpen(true)}>
            <PersonAddIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              localStorage.removeItem("jwt");
              setLoggedIn(false);
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Divider />
      {data?.getFriendsFromMessages.map((item) => (
        <UserCard key={item.id} item={item} />
      ))}
      <StatusDialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
      />
      <AddFriendDialog
        open={addFriendDialogOpen}
        onClose={() => setAddFriendDialogOpen(false)}
      />
    </Box>
  );
};

export default SideBar;
