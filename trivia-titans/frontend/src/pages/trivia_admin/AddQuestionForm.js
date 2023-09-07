import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  IconButton,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Container,
  Box,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Create a custom Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

Modal.setAppElement("#root");

const AddQuestionForm = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [difficulty, setDifficulty] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State variable to hold the error message

  const handleAddQuestion = async () => {
    // Validate the form fields before submitting
    if (!question || choices.includes("") || !difficulty) {
      setErrorMessage("Please fill out all the fields.");
      return;
    }

    try {
      // Make an API call to add the new question using axios
      await axios.post(
        "https://a4r4thtih1.execute-api.us-east-1.amazonaws.com/add_question",
        {
          question_text: question,
          option1: choices[0],
          option2: choices[1],
          option3: choices[2],
          option4: choices[3],
          answer: choices[correctAnswer],
        }
      );

      // Clear the form fields
      setQuestion("");
      setChoices(["", "", "", ""]);
      setCorrectAnswer(0);
      setDifficulty("");

      // Close the modal after adding the question
      setModalOpen(false);
      setErrorMessage("");
      window.location.reload();
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <IconButton color="primary" onClick={() => setModalOpen(true)}>
            <AddCircleIcon />
            Add Question
          </IconButton>
        </Box>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setModalOpen(false)}
          contentLabel="Add Question Modal"
        >
          <div className="modal-content">
            <span className="close-button" onClick={() => setModalOpen(false)}>
              <CancelIcon />
            </span>
            <h2>Add New Question</h2>
            <form>
              <TextField
                label="Question Text"
                variant="outlined"
                fullWidth
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                sx={{ mb: 2 }}
              />
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel>Choices</FormLabel>
                <RadioGroup
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(parseInt(e.target.value))}
                >
                  {choices.map((choice, index) => (
                    <FormControlLabel
                      key={index}
                      value={index.toString()}
                      control={<Radio />}
                      label={
                        <TextField
                          label={`Option ${index + 1}`}
                          variant="outlined"
                          value={choice}
                          onChange={(e) =>
                            handleChoiceChange(index, e.target.value)
                          }
                        />
                      }
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  label="Difficulty"
                >
                  <MenuItem value="">
                    <em>Select Difficulty</em>
                  </MenuItem>
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddQuestion}
                  sx={{ mx: 1 }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setModalOpen(false)}
                  sx={{ mx: 1 }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
            
            {/* Conditionally render the error message */}
            {errorMessage && (
              <Box sx={{ color: "red", textAlign: "center", my: 2 }}>
                {errorMessage}
              </Box>
            )}
            
          </div>
        </Modal>
      </Container>
    </ThemeProvider>
  );
};

export default AddQuestionForm;
