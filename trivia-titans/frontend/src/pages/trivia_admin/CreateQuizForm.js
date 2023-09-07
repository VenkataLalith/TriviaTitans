import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { TextField, Button, Typography, Box, IconButton, Select, MenuItem } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import DatePicker from "react-datepicker"; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import CSS for react-datepicker
import AddCircleIcon from "@mui/icons-material/AddCircle";

Modal.setAppElement("#root");

const CreateQuizForm = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State variable to hold the error message

  const [quizName, setQuizName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [quizCategory, setQuizCategory] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [totalPoints, setTotalPoints] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [totalNumQuestions, setTotalNumQuestions] = useState("");

  const handleAddQuestion = async () => {
    // Validation check: All fields are required
    if (
      !quizName ||
      !startDate ||
      !endDate ||
      !quizCategory ||
      !difficultyLevel ||
      !totalPoints ||
      !quizDescription ||
      !totalNumQuestions
    ) {
      setErrorMessage("Please fill out all the fields.");
      return;
    }

    // Validation check: End date should be after or the same as the starting date
    if (endDate < startDate) {
      setErrorMessage("End date should be after or the same as the starting date.");
      return;
    }

    try {
      await axios.post(
        "https://a4r4thtih1.execute-api.us-east-1.amazonaws.com/create_quiz_from_category",
        {
          quiz_name: quizName,
          start_date: startDate ? startDate.toISOString() : "", // Convert date object to string for API
          end_date: endDate ? endDate.toISOString() : "", // Convert date object to string for API
          quiz_category: quizCategory,
          difficulty_level: difficultyLevel,
          total_points: totalPoints,
          quiz_description: quizDescription,
          total_num_questions: totalNumQuestions,
        }
      );

      // Clear the form fields
      setQuizName("");
      setStartDate(null);
      setEndDate(null);
      setQuizCategory("");
      setDifficultyLevel("");
      setTotalPoints("");
      setQuizDescription("");
      setTotalNumQuestions("");

      // Close the modal after adding the question
      setModalOpen(false);

      // Clear any previous error message
      setErrorMessage("");
      window.location.reload();
    } catch (error) {
      console.error("Error adding quiz:", error);

      // Handle the backend error response here and update the error message state
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred while creating the quiz.");
      }
    }
  };

  return (
    <div>
      <IconButton color="primary" onClick={() => setModalOpen(true)}>
        <AddCircleIcon />
        Add Quiz
      </IconButton>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Add Quiz Modal"
      >
        <Box className="modal-content" sx={{ p: 3 }}>
          <IconButton
            sx={{ position: "absolute", top: 0, right: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">Add New Quiz</Typography>
          <form>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Quiz Name"
              fullWidth
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
            />
            <DatePicker
              placeholderText="Start Date"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
            <DatePicker
              placeholderText="End Date"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
            />

            <Select
              fullWidth
              value={quizCategory}
              onChange={(e) => setQuizCategory(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Quiz Category" }}
            >
              <MenuItem value="" disabled>
                Quiz Category
              </MenuItem>
              <MenuItem value="General Knowledge">General Knowledge</MenuItem>
              <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="History">History</MenuItem>
              <MenuItem value="Science">Science</MenuItem>
              <MenuItem value="Miscellaneous">Miscellaneous</MenuItem> 
            </Select>

            <Select
              fullWidth
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Difficulty Level" }}
            >
              <MenuItem value="" disabled>
                Difficulty Level
              </MenuItem>
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </Select>

            <TextField
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Total Points"
              fullWidth
              value={totalPoints}
              onChange={(e) => setTotalPoints(e.target.value)}
            />
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Quiz Description"
              fullWidth
              multiline
              rows={4}
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
            />
            <TextField
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Total Number of Questions"
              fullWidth
              value={totalNumQuestions}
              onChange={(e) => setTotalNumQuestions(e.target.value)}
            />

            <Box mt={2}>
              <Button
                type="button"
                onClick={handleAddQuestion}
                variant="contained"
                color="primary"
              >
                Add
              </Button>
              <Button
                type="button"
                onClick={() => setModalOpen(false)}
                variant="contained"
                color="secondary"
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            </Box>
          </form>

          {/* Conditionally render the error message */}
          {errorMessage && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}
        </Box>
      </Modal>
    </div>
  );
};

export default CreateQuizForm;
