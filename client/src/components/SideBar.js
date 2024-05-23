import React, { useState, useEffect } from "react";
import { Box, Typography, Divider, Stack, IconButton } from "@mui/material";
import UserCard from "./UserCard";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useQuery, useSubscription } from "@apollo/client";
import { GET_FRIENDS_FROM_MESSAGES } from "../graphql/queries";
// import { MSG_SUB } from "../graphql/subscriptions";
import StatusDialog from "./StatusDialog";
import AddFriendDialog from "./AddFriendDialog";
import { useDispatch, useSelector } from "react-redux";
import { setFriends, addOrUpdateFriend } from "../app/slices/friendsSlice";

const SideBar = ({ setLoggedIn }) => {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friends);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false); // State for AddFriendDialog
  const { loading, data, error } = useQuery(GET_FRIENDS_FROM_MESSAGES);
  // const { data: subscriptionData } = useSubscription(MSG_SUB);

  useEffect(() => {
    if (data) {
      dispatch(setFriends(data.getFriendsFromMessages));
    }
  }, [data, dispatch]);

  // useEffect(() => {
  //   if (subscriptionData) {
  //     const { sender } = subscriptionData.messageAdded;
  //     dispatch(addOrUpdateFriend(sender));
  //   }
  // }, [subscriptionData, dispatch]);

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
      {friends.map((friend) => (
        <UserCard key={friend.id} item={friend} />
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
