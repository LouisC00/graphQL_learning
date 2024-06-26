import { Box, Typography } from "@mui/material";
import React from "react";

const MessageCard = ({ text, date, direction }) => {
  return (
    <Box display="flex" justifyContent={direction} flexDirection="row">
      <Box>
        <Typography variant="subtitle1" backgroundColor="white" padding="5px">
          {text}
        </Typography>
        <Typography variant="caption">
          {new Date(date).toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageCard;
