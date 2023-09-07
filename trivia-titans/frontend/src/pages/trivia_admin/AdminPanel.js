import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AddQuestionForm from "./AddQuestionForm";
import CreateGameForm from "./CreateQuizForm";
import QuestionList from "./QuestionList";
import AnalyticsDashboard from "./AnalyticsDashboard";
import GameList from "./QuizList";
import { Icon, Tab, Tabs, Typography } from "@mui/material";

import "bootstrap-icons/font/bootstrap-icons.css";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("questions");

  // Create a Material-UI theme
  const theme = createTheme({
    palette: {
      primary: {
        main: "#1976D2", 
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="containeradmin mt-4">
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab
            label={
              <Typography variant="body1">
                <Icon className="bi bi-question-circle" />
                Questions
              </Typography>
            }
            value="questions"
          />
          <Tab
            label={
              <Typography variant="body1">
                <Icon className="bi bi-card-list" />
                Quiz
              </Typography>
            }
            value="quiz"
          />
          <Tab
            label={
              <Typography variant="body1">
                <Icon className="bi bi-house-door" />
                Dashboard
              </Typography>
            }
            value="dashboard"
          />
        </Tabs>

        <div className="tab-content mt-4">
          {activeTab === "questions" && (
            <div
              id="questions"
              className={`tab-pane fade ${
                activeTab === "questions" ? "show active" : ""
              }`}
            >
              <AddQuestionForm />
              <QuestionList />
            </div>
          )}
          {activeTab === "quiz" && (
            <div
              id="quiz"
              className={`tab-pane fade ${
                activeTab === "quiz" ? "show active" : ""
              }`}
            >
              <CreateGameForm />
              <GameList />
            </div>
          )}
          {activeTab === "dashboard" && (
            <div
              id="dashboard"
              className={`tab-pane fade ${
                activeTab === "dashboard" ? "show active" : ""
              }`}
            >
              <AnalyticsDashboard />
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AdminPanel;
