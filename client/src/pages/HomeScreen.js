import React, { useEffect } from "react";
import { Box } from "@mui/material";
import SideBar from "../components/SideBar";
import { Route, Routes } from "react-router-dom";
import Welcome from "../components/Welcome";
import ChatScreen from "../components/ChatScreen";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER_STATUS } from "../graphql/queries";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/:id/:name" element={<ChatScreen />} />
    </Routes>
  );
};

const HomeScreen = ({ setLoggedIn }) => {
  useQuery(GET_CURRENT_USER_STATUS, {
    onError: (error) => {
      console.error("Error fetching user status:", error);
      if (error.message.includes("User not found")) {
        localStorage.removeItem("jwt");
        setLoggedIn(false);
      }
    },
  });

  return (
    <Box display="flex">
      <SideBar setLoggedIn={setLoggedIn} />
      <AllRoutes />
    </Box>
  );
};

export default HomeScreen;
