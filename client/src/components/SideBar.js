import React from "react";
import { Box, Typography, Divider, Stack } from "@mui/material";
import UserCard from "./UserCard";
import LogoutIcon from "@mui/icons-material/Logout";

const SideBar = ({ setLoggedIn }) => {
  const users = [
    { id: 1, firstName: "one", lastName: "o" },
    { id: 2, firstName: "two", lastName: "t" },
    { id: 3, firstName: "three", lastName: "t" },
  ];

  return (
    <Box backgroundColor="#f7f7f7" height="100vh" width="250px" padding="0.8vw">
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">Chat</Typography>
        <LogoutIcon
          onClick={() => {
            localStorage.removeItem("jwt");
            setLoggedIn(false);
          }}
        />
      </Stack>
      <Divider />
      {users.map((item) => {
        return <UserCard key={item.id} item={item} />;
      })}
    </Box>
  );
};

export default SideBar;
