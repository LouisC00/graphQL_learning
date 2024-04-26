// rafce
import React, { useRef, useState } from "react";
import { Box, Stack, Typography, Button, TextField, Card } from "@mui/material";

const AuthScreen = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [formData, setFormData] = useState({});
  const authForm = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Box
      ref={authForm}
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="90vh"
    >
      <Card sx={{ padding: "40px" }}>
        <Stack direction="column" spacing={2} sx={{ width: "400px" }}>
          <Typography variant="h5">
            {showLogin ? "Login" : "Sign Up"}
          </Typography>
          {!showLogin && (
            <>
              {" "}
              <TextField
                name="firstName"
                label="First Name"
                variant="standard"
                onChange={handleChange}
              />
              <TextField
                name="lastName"
                label="Last Name"
                variant="standard"
                onChange={handleChange}
              />
            </>
          )}
          <TextField
            type="email"
            name="email"
            label="email"
            variant="standard"
            onChange={handleChange}
          />
          <TextField
            type="password"
            name="password"
            label="password"
            variant="standard"
            onChange={handleChange}
          />
          <Typography
            variant="subtitle1"
            onClick={() => {
              setShowLogin((showLogin) => !showLogin);
              setFormData(() => ({}));
              authForm.current.reset();
            }}
            sx={{
              cursor: "pointer",
              color: "blue", // This uses a basic blue color
              textDecoration: "underline",
            }}
          >
            {!showLogin
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </Typography>
          <Button variant="outlined" type="submit">
            {showLogin ? "Login" : "Sign Up"}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default AuthScreen;
