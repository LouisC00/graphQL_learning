// rafce
import React, { useRef, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Card,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { SIGNUP_USER, LOGIN_USER } from "../graphql/mutations";

const AuthScreen = ({ setLoggedIn }) => {
  const [showLogin, setShowLogin] = useState(true);
  const [formData, setFormData] = useState({});
  const authForm = useRef(null);

  const [
    signupUser,
    { data: signupData, loading: signupLoading, error: signupError },
  ] = useMutation(SIGNUP_USER, {
    onCompleted() {
      setShowLogin(true);
    },
    onError(error) {},
  });

  const [loginUser, { loading: loginLoading, error: loginError }] = useMutation(
    LOGIN_USER,
    {
      onCompleted(data) {
        localStorage.setItem("jwt", data.signinUser.token);
        setLoggedIn(true);
      },
      onError(error) {},
    }
  );

  if (signupLoading || loginLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Box textAlign="center">
          <CircularProgress />
          <Typography variant="h6">Authenticating...</Typography>
        </Box>
      </Box>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showLogin) {
      loginUser({
        variables: {
          userSignin: formData,
        },
      });
    } else {
      signupUser({
        variables: {
          userNew: formData,
        },
      });
    }
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
          {signupData && (
            <Alert severity="success">
              {signupData.signupUser.firstName} Signed Up
            </Alert>
          )}
          {signupError && <Alert severity="error">{signupError.message}</Alert>}
          {loginError && <Alert severity="error">{loginError.message}</Alert>}
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
                required
              />
              <TextField
                name="lastName"
                label="Last Name"
                variant="standard"
                onChange={handleChange}
                required
              />
            </>
          )}
          <TextField
            type="email"
            name="email"
            label="email"
            variant="standard"
            onChange={handleChange}
            required
          />
          <TextField
            type="password"
            name="password"
            label="password"
            variant="standard"
            onChange={handleChange}
            required
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
