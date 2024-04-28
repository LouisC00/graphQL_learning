import "./App.css";
import HomeScreen from "./pages/HomeScreen";
import AuthScreen from "./pages/AuthScreen";
import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("jwt") ? true : false
  );

  return (
    <>
      {loggedIn ? (
        <HomeScreen setLoggedIn={setLoggedIn} />
      ) : (
        <AuthScreen setLoggedIn={setLoggedIn} />
      )}
    </>
  );
}

export default App;
