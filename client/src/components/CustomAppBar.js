import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

function CustomAppBar({ name, status }) {
  return (
    <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: 0 }}>
      <Toolbar>
        <Avatar
          src={`https://api.dicebear.com/8.x/initials/svg?seed=${name}`}
          sx={{ width: 32, height: 32, mr: 2 }}
          alt="avatar"
        />
        <Typography variant="h6" color="black">
          {name}
          <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
            {status || ""}
          </Typography>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default CustomAppBar;
