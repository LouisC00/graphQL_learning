import React, { useState, useEffect, useRef } from "react";
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
  const chatBoxRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useQuery(GET_MSG, {
    variables: { receiverId: +id },
    onCompleted(data) {
      setMessages(data.messagesByUser);
      setTimeout(scrollToBottom, 40); // Ensure DOM is updated
    },
    onError(error) {
      toast.error(`Error fetching messages: ${error.message}`);
    },
  });

  const [sendMessage] = useMutation(SEND_MSG, {
    variables: {
      receiverId: +id,
      text,
    },
    onCompleted(data) {
      // Message was successfully accepted by the server
      setText("");
      // Optimistically add the message to the chat
      setMessages((prevMessages) => [...prevMessages, data.createMessage]);
      setTimeout(scrollToBottom, 40); // Ensure DOM is updated
    },
    onError(error) {
      toast.error(`Error sending message: ${error.message}`);
      // Optionally remove the message if not using a subscription to validate
    },
  });

  const { data: subData } = useSubscription(MSG_SUB, {
    onError(error) {
      toast.error(`Error in subscription: ${error.message}`);
    },
  });

  useEffect(() => {
    if (
      subData &&
      (subData.messageAdded.receiverId === +id ||
        subData.messageAdded.senderId === +id)
    ) {
      setMessages((prevMessages) => [...prevMessages, subData.messageAdded]);
      setTimeout(() => {
        if (isAtBottom) {
          scrollToBottom();
        }
      }, 40);
    }
  }, [subData, id]); // Include `id` in dependencies to react to changes in the chat room

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    const handleScroll = () => {
      if (!chatBox) return;
      const atBottom =
        chatBox.scrollHeight - chatBox.clientHeight <= chatBox.scrollTop + 5;
      setIsAtBottom(atBottom);
    };

    chatBox.addEventListener("scroll", handleScroll);
    return () => chatBox.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

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
        ref={chatBoxRef}
        backgroundColor="#f5f5f5"
        height="80vh"
        padding="10px"
        sx={{ overflowY: "auto" }}
      >
        {messages.map((msg) => (
          <MessageCard
            key={msg.createdAt}
            text={msg.text}
            date={msg.createdAt}
            direction={msg.receiverId === +id ? "end" : "start"}
          />
        ))}
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
            if (text.trim() === "") return;
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
