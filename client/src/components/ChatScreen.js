import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { useParams } from "react-router-dom";
import { Box, TextField, Stack, Button } from "@mui/material";
import MessageCard from "./MessageCard";
import CustomAppBar from "./CustomAppBar";
import { GET_MSG } from "../graphql/queries";
import { SEND_MSG } from "../graphql/mutations";
import {
  useMutation,
  useQuery,
  useSubscription,
  useApolloClient,
  gql,
} from "@apollo/client";
import SendIcon from "@mui/icons-material/Send";
import { MSG_SUB } from "../graphql/subscriptions";
import toast from "react-hot-toast";
import lodash from "lodash";

const ChatScreen = () => {
  const { id, name, status } = useParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const chatBoxRef = useRef(null);
  const atBottomRef = useRef(true);
  const client = useApolloClient();

  const { data, loading, fetchMore } = useQuery(GET_MSG, {
    variables: { receiverId: parseInt(id), limit: 15 },
    onCompleted(data) {
      setMessages(data.messagesByUser.edges.map((edge) => edge.node));
      setHasMore(data.messagesByUser.pageInfo.hasNextPage);
    },
    onError(error) {
      toast.error(`Error fetching messages: ${error.message}`);
    },
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: false,
  });

  const [sendMessage] = useMutation(SEND_MSG, {
    variables: {
      receiverId: parseInt(id),
      text,
    },
    onCompleted(data) {
      setText("");
      const newMessage = data.createMessage;
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      client.cache.modify({
        fields: {
          messagesByUser(existingMessageRefs = {}, { readField }) {
            const newMessageRef = client.cache.writeFragment({
              data: newMessage,
              fragment: gql`
                fragment NewMessage on Message {
                  id
                  text
                  receiverId
                  senderId
                  createdAt
                }
              `,
            });

            if (
              existingMessageRefs.edges.some(
                (ref) => readField("id", ref.node) === newMessage.id
              )
            ) {
              return existingMessageRefs;
            }

            return {
              ...existingMessageRefs,
              edges: [{ node: newMessageRef }, ...existingMessageRefs.edges],
            };
          },
        },
      });
    },
    onError(error) {
      toast.error(`Error sending message: ${error.message}`);
    },
  });

  useSubscription(MSG_SUB, {
    variables: { receiverId: parseInt(id) },
    onData: ({ data }) => {
      const newMessage = data.data.messageAdded;
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      client.cache.modify({
        fields: {
          messagesByUser(existingMessageRefs = {}, { readField }) {
            const newMessageRef = client.cache.writeFragment({
              data: newMessage,
              fragment: gql`
                fragment NewMessage on Message {
                  id
                  text
                  receiverId
                  senderId
                  createdAt
                }
              `,
            });

            if (
              existingMessageRefs.edges.some(
                (ref) => readField("id", ref.node) === newMessage.id
              )
            ) {
              return existingMessageRefs;
            }

            return {
              ...existingMessageRefs,
              edges: [...existingMessageRefs.edges, { node: newMessageRef }],
            };
          },
        },
      });
    },
    onError: (error) => {
      toast.error(`Error in subscription: ${error.message}`);
    },
  });

  const [loadingMore, setLoadingMore] = useState(false);
  const previousScrollHeight = useRef(0);

  const loadMoreMessages = useCallback(() => {
    if (!data || !data.messagesByUser.pageInfo.hasNextPage || loading) return;

    setLoadingMore(false);
    previousScrollHeight.current = chatBoxRef.current.scrollHeight;

    fetchMore({
      variables: {
        cursor: data.messagesByUser.pageInfo.endCursor,
        limit: 10,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        const newEdges = fetchMoreResult.messagesByUser.edges.map(
          (edge) => edge.node
        );

        // Update the state with new messages
        setMessages((prevMessages) => [...newEdges, ...prevMessages]);

        return {
          messagesByUser: {
            ...fetchMoreResult.messagesByUser,
            edges: [
              ...newEdges.map((message) => ({ node: message })),
              ...prev.messagesByUser.edges,
            ],
            pageInfo: fetchMoreResult.messagesByUser.pageInfo,
          },
        };
      },
    }).finally(() => {
      setLoadingMore(true);
    });
  }, [data, fetchMore, loading]);

  useLayoutEffect(() => {
    if (!loadingMore) return;
    const newScrollHeight = chatBoxRef.current.scrollHeight;
    const heightDifference = newScrollHeight - previousScrollHeight.current;
    chatBoxRef.current.scrollTop += heightDifference;
    setLoadingMore(false);
  }, [loadingMore]);

  useEffect(() => {
    const currentChatBox = chatBoxRef.current;

    const handleScroll = lodash.debounce(() => {
      if (!currentChatBox) return;
      const { scrollTop, scrollHeight, clientHeight } = currentChatBox;

      const isAtBottom = scrollHeight - clientHeight <= scrollTop + 1;
      atBottomRef.current = isAtBottom;

      const isAtTop = scrollTop === 0;
      if (isAtTop && hasMore && !loadingMore && !loading) {
        loadMoreMessages();
      }
    }, 20);

    if (currentChatBox) {
      currentChatBox.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentChatBox) {
        currentChatBox.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMore, loadMoreMessages, loadingMore, loading]);

  useLayoutEffect(() => {
    if (atBottomRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  return (
    <Box flexGrow={1}>
      <CustomAppBar id={id} name={name} status={status} />
      <Box
        ref={chatBoxRef}
        backgroundColor="#f5f5f5"
        height="80vh"
        padding="10px"
        sx={{ overflowY: "auto" }}
      >
        {messages.map((msg) => (
          <MessageCard
            key={msg.id}
            text={msg.text}
            date={msg.createdAt}
            direction={msg.receiverId === +id ? "end" : "start"}
          />
        ))}
        {/* {hasMore && !loading && (
          <Button onClick={loadMoreMessages}>Load More</Button>
        )} */}
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
