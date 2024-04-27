import { Stack, Avatar, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const UserCard = ({ item: { firstName, lastName, id } }) => {
  const navigate = useNavigate();

  return (
    <Stack
      className="usercard"
      direction="row"
      spacing={2}
      sx={{ py: 1 }}
      display="flex"
      alignItems="center"
      onClick={() => navigate(`/${id}/${firstName} ${lastName}`)}
    >
      <Avatar
        src={`https://api.dicebear.com/8.x/initials/svg?seed=${firstName} ${lastName}`}
        sx={{ width: "32px", height: "32px" }}
        alt="avatar"
      />
      <Typography variant="subtitle2">
        {firstName} {lastName}
      </Typography>
    </Stack>
  );
};

export default UserCard;
