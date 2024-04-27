import React from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Avatar,
  Typography,
  TextField,
} from "@mui/material";
import MessageCard from "./MessageCard";

const ChatScreen = () => {
  const { id, name } = useParams();
  return (
    <Box flexGrow={1}>
      <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: 0 }}>
        <Toolbar>
          <Avatar
            src={`https://api.dicebear.com/8.x/initials/svg?seed=${name}`}
            sx={{ width: "32px", height: "32px", mr: 2 }}
            alt="avatar"
          />
          <Typography varaint="h6" color="black">
            {name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        backgroundColor="#f5f5f5"
        height="80vh"
        padding="10px"
        sx={{ overflowY: "auto" }}
      >
        <MessageCard text="hi paxu" date="1234" direction="end" />
        <MessageCard text="hi paxu" date="1234" />
        <MessageCard text="hi paxu" date="1234" />
      </Box>
      <TextField
        placeholder="Enter a message"
        variant="standard"
        fullWidth
        multiline
        rows={2}
      />
    </Box>
  );
};

export default ChatScreen;
