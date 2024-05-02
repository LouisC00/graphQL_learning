import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Avatar,
  Typography,
  TextField,
  Stack,
} from "@mui/material";
import MessageCard from "./MessageCard";
import { GET_MSG } from "../graphql/queries";
import { SEND_MSG } from "../graphql/mutations";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import SendIcon from "@mui/icons-material/Send";
import { MSG_SUB } from "../graphql/subscriptions";
import toast from "react-hot-toast";

const ChatScreen = () => {
  const { id, name } = useParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const { loading } = useQuery(GET_MSG, {
    variables: { receiverId: +id },
    onCompleted(data) {
      setMessages(data.messagesByUser);
    },
    onError(error) {
      toast.error(`Error fetching messages: ${error.message}`);
    },
  });

  const [sendMessage] = useMutation(SEND_MSG, {
    onCompleted() {
      setText("");
    },
    onError(error) {
      toast.error(`Error sending message: ${error.message}`);
    },
  });

  const { data: subData } = useSubscription(MSG_SUB, {
    onError(error) {
      toast.error(`Error in subscription: ${error.message}`);
    },
  });

  useEffect(() => {
    if (subData) {
      setMessages((prevMessages) => [...prevMessages, subData.messageAdded]);
    }
  }, [subData]);

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
        {loading ? (
          <Typography variant="h6">loading chats</Typography>
        ) : (
          messages.map((msg) => {
            return (
              <MessageCard
                key={msg.createdAt}
                text={msg.text}
                date={msg.createdAt}
                direction={msg.receiverId === +id ? "end" : "start"}
              />
            );
          })
        )}
      </Box>
      <Stack direction="row" sx={{ padding: "3px" }}>
        <TextField
          placeholder="Enter a message"
          variant="standard"
          fullWidth
          multiline
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <SendIcon
          fontSize="large"
          onClick={() => {
            sendMessage({
              variables: {
                receiverId: +id,
                text,
              },
            });
          }}
        />
      </Stack>
    </Box>
  );
};

export default ChatScreen;
