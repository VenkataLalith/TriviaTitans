import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Typography, Button, Container, IconButton, Box } from "@mui/material";
import { Settings, Logout, Group } from "@mui/icons-material";
import APIS from "../../apis.json";
import axios from "axios";
import "./profile.css";

function Profile() {
  const userEmail = window.localStorage.getItem("LOGGED_IN_USER_USER_EMAIL");
  const navigate = useNavigate();
  const [alertShown, setAlertShown] = useState(false);

  const redirectToQuiz = () => {
    navigate("/quiz_lobby");
  };

  const redirectToTeamManagement = () => {
    navigate("/team_home");
  };

  const redirectToLeaderBoard = () => {
    navigate("/leaderboard");
  };

  const verifyLogin = () => {
    const token = window.localStorage.getItem("ACCESS_TOCKEN");
    if (!token) {
      alert("Please Login!!");
      navigate("/login");
    }
  };

  const handleLogout = () => {
    const api = APIS["aws-lambda-api-authentication"] + "/signout";
    const AccessToken = localStorage.getItem("ACCESS_TOCKEN");
    const token = { AccessToken };
    axios
      .post(api, token)
      .then((response) => {
        if (response.status === 404) {
          alert("Error Signing out");
        }
        alert("Signed Out Successfully");
        localStorage.clear();
        navigate("/");
      })
      .catch((err) => {
        console.log(err.response.data.error.message);
        localStorage.clear();
        navigate("/");
      });
  };

  useEffect(() => {
    verifyLogin();
    const alertShownBefore = localStorage.getItem("ALERT_SHOWN");
    if (!alertShownBefore) {
      console.log("insideAPI");
      axios
        .post(
          "https://3bc5m0kbt8.execute-api.us-east-1.amazonaws.com/emailforAchievementAlert",
          { email: userEmail }
        )
        .then((response) => {
          console.log("alert triggered");
          const userScore = response.data.score; // Assuming the Lambda response contains the user's score
          if (userScore >= 1 && !alertShown) {
            console.log("alertshown");

            alert(response.data.message);
            setAlertShown(true);

            localStorage.setItem("ALERT_SHOWN", "true");
          }
        })
        .catch((error) => {
          console.error("Error fetching user score:", error);
        });
    }
  }, []);

  return (
    <Container maxWidth="md" className="profile-container">
      <div className="logout-button-container">
        <Link to="/userdetails" className="setting-btn-in-profile">
          <IconButton
            aria-label="settings"
            size="large"
            style={{ color: "#888" }}
          >
            <Settings />
          </IconButton>
        </Link>
        <Button
          variant="outlined"
          color="secondary"
          className="logout-button"
          startIcon={<Logout />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      <Typography variant="h3">{userEmail}</Typography>
      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className="profile-button"
          onClick={redirectToQuiz}
        >
          Select Quiz
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          className="profile-button"
          startIcon={<Group />}
          onClick={redirectToTeamManagement}
        >
          Manage Team
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          className="profile-button"
          startIcon={<Group />}
          onClick={redirectToLeaderBoard}
        >
          Leaderboard
        </Button>
      </Box>
    </Container>
  );
}

export default Profile;
