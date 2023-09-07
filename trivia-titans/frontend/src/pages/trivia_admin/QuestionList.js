import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Grid,
} from "@mui/material";

Modal.setAppElement("#root");

const QuestionList = () => {
  const [questionList, setQuestionList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get("https://a4r4thtih1.execute-api.us-east-1.amazonaws.com/get_all_questions")
      .then((response) => setQuestionList(response.data.questions))
      .catch((error) => console.error("Error fetching question list:", error));
  }, []);

  useEffect(() => {
    const filteredQuestions = questionList.filter((question) =>
      question.question_text.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredQuestions(filteredQuestions);
  }, [searchQuery, questionList]);

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleSaveQuestion = async () => {
    try {
      // Make an API call to update the question using axios
      await axios.put(
        `https://a4r4thtih1.execute-api.us-east-1.amazonaws.com/update_question/${editingQuestion.question_id}`,
        editingQuestion
      );

      // After successful update, update the question list with the edited question
      const updatedQuestionList = questionList.map((question) =>
        question.question_id === editingQuestion.question_id
          ? editingQuestion
          : question
      );
      setQuestionList(updatedQuestionList);

      // Close the modal after saving
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      // Make an API call to delete the question using axios
      await axios.delete(
        `https://a4r4thtih1.execute-api.us-east-1.amazonaws.com/delete_question/${questionId}`
      );

      // After successful deletion, update the question list to remove the deleted question
      setQuestionList((prevQuestionList) =>
        prevQuestionList.filter(
          (question) => question.question_id !== questionId
        )
      );
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditingQuestion((prevEditingQuestion) => ({
      ...prevEditingQuestion,
      [name]: value,
    }));
  };

  return (
    <Container>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        my={2}
      >
        <Typography variant="h4">Question List</Typography>
        {/* <Button variant="contained" color="primary">
          Add Question
        </Button> */}
      </Box>
      <Box my={2}>
        <div className="form-group">
          <TextField
            type="text"
            variant="outlined"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={handleSearchQueryChange}
            fullWidth
          />
        </div>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question Text</TableCell>
              <TableCell>Options</TableCell>
              <TableCell>Answer</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuestions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No matching results</TableCell>
              </TableRow>
            ) : (
              filteredQuestions.map((question) => (
                <TableRow key={question.question_id}>
                  <TableCell>{question.question_text}</TableCell>
                  <TableCell>
                    <ul>
                      <li>{question.option1}</li>
                      <li>{question.option2}</li>
                      <li>{question.option3}</li>
                      <li>{question.option4}</li>
                    </ul>
                  </TableCell>
                  <TableCell>{question.answer}</TableCell>
                  <TableCell>{question.category}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        size="small" // Set the size to 'small'
                        onClick={() => handleEditQuestion(question)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<DeleteIcon />}
                        size="small" // Set the size to 'small'
                        onClick={() =>
                          handleDeleteQuestion(question.question_id)
                        }
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleModalClose}
          contentLabel="Edit Modal"
          style={{
            overlay: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            content: {
              width: "66%",
              margin: "0 auto",
            },
          }}
        >
          <div className="modal-content">
            <span className="close-button" onClick={handleModalClose}>
              &times;
            </span>
            <h2>Edit Question</h2>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Question Text"
                    name="question_text"
                    value={editingQuestion.question_text}
                    onChange={handleFormChange}
                    variant="outlined"
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Option 1"
                    name="option1"
                    value={editingQuestion.option1}
                    onChange={handleFormChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Option 2"
                    name="option2"
                    value={editingQuestion.option2}
                    onChange={handleFormChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Option 3"
                    name="option3"
                    value={editingQuestion.option3}
                    onChange={handleFormChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Option 4"
                    name="option4"
                    value={editingQuestion.option4}
                    onChange={handleFormChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Answer"
                    name="answer"
                    value={editingQuestion.answer}
                    onChange={handleFormChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" mt={2} px={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveQuestion}
                    >
                      Save
                    </Button>
                    <Box ml={1}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleModalClose}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </div>
        </Modal>
      )}
    </Container>
  );
};

export default QuestionList;
