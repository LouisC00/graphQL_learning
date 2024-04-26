import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import UserCard from "./UserCard";

const SideBar = () => {
  const users = [
    { id: 1, firstName: "one", lastName: "o" },
    { id: 2, firstName: "two", lastName: "t" },
    { id: 3, firstName: "three", lastName: "t" },
  ];

  return (
    <Box backgroundColor="#f7f7f7" height="100vh" width="250px" padding="0.8vw">
      <Typography variant="h6">Chat</Typography>
      <Divider />
      {users.map((item) => {
        return <UserCard key={item.id} item={item} />;
      })}
    </Box>
  );
};

export default SideBar;
