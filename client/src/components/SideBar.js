import React, { useState } from "react";
import { Box, Typography, Divider, Stack, IconButton } from "@mui/material";
import UserCard from "./UserCard";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { useQuery } from "@apollo/client";
import { GET_ALL_USERS } from "../graphql/queries";
import StatusDialog from "./StatusDialog"; // Import the StatusDialog component

const SideBar = ({ setLoggedIn }) => {
  const { loading, data, error } = useQuery(GET_ALL_USERS);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  if (loading) return <Typography variant="h6">Loading chats...</Typography>;
  if (error) {
    console.log(error.message);
    return <Typography variant="h6">Error loading chats!</Typography>;
  }

  return (
    <Box backgroundColor="#f7f7f7" height="100vh" width="250px" padding="0.8vw">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Chat</Typography>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => setStatusDialogOpen(true)}>
            <SettingsIcon />
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
      {data.getAllUsers.map((item) => (
        <UserCard key={item.id} item={item} />
      ))}
      <StatusDialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
      />
    </Box>
  );
};

export default SideBar;
