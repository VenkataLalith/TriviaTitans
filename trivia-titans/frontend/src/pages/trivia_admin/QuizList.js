import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import {
  Button,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

Modal.setAppElement("#root");

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

const QuizList = () => {
  const [quizList, setQuizList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    quizId: null,
    quizName: "",
    quizCategory: "", // State for category dropdown
    difficultyLevel: "", // State for difficulty level dropdown
    startDate: new Date(),
    endDate: new Date(),
    totalPoints: "",
    quizDescription: "",
    totalNumQuestions: "",
  });
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get(
        "https://a4r4thtih1.execute-api.us-east-1.amazonaws.com/list_quizzes"
      )
      .then((response) => setQuizList(response.data.quizzes))
      .catch((error) => console.error("Error fetching quiz list:", error));
  }, []);

  const handleEditGame = (quizId) => {
    const quizToEdit = quizList.find((quiz) => quiz.quiz_id === quizId);
    if (quizToEdit) {
      setEditFormData({
        quizId: quizToEdit.quiz_id,
        quizName: quizToEdit.quiz_name,
        quizCategory: quizToEdit.quiz_category,
        difficultyLevel: quizToEdit.difficulty_level,
        startDate: new Date(quizToEdit.start_date),
        endDate: new Date(quizToEdit.end_date),
        totalPoints: quizToEdit.total_points,
        quizDescription: quizToEdit.quiz_description,
        totalNumQuestions: quizToEdit.total_num_questions,
      });
      setModalOpen(true);
    }
  };

  const handleDeleteGame = (quizId) => {
    axios
      .delete(
        `https://a4r4thtih1.execute-api.us-east-1.amazonaws.com/delete_quiz/${quizId}`
      )
      .then((response) => {
        setQuizList((prevQuizList) =>
          prevQuizList.filter((quiz) => quiz.quiz_id !== quizId)
        );
      })
      .catch((error) => console.error("Error deleting quiz:", error));
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setQuestions([]); // Reset questions when closing the modal
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleDateChange = (name, date) => {
    setEditFormData({
      ...editFormData,
      [name]: date,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formattedFormData = {
      quiz_name: editFormData.quizName,
      start_date: editFormData.startDate.toISOString(),
      end_date: editFormData.endDate.toISOString(),
      quiz_category: editFormData.quizCategory,
      difficulty_level: editFormData.difficultyLevel,
      total_points: editFormData.totalPoints,
      quiz_description: editFormData.quizDescription,
      total_num_questions: editFormData.totalNumQuestions,
    };

    axios
      .put(
        `https://a4r4thtih1.execute-api.us-east-1.amazonaws.com/edit_quiz/${editFormData.quizId}`,
        formattedFormData
      )
      .then((response) => {
        setQuizList((prevQuizList) =>
          prevQuizList.map((quiz) =>
            quiz.quiz_id === editFormData.quizId
              ? { ...quiz, ...formattedFormData }
              : quiz
          )
        );
        setModalOpen(false);
      })
      .catch((error) => console.error("Error updating quiz:", error));
  };

  const handleViewQuestions = (quizId) => {
    axios
      .get(
        `https://a4r4thtih1.execute-api.us-east-1.amazonaws.com/get_quiz_questions/${quizId}`
      )
      .then((response) => {
        setQuestions(response.data.questions);
        setModalOpen(true);
      })
      .catch((error) => console.error("Error fetching quiz questions:", error));
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredQuizList = quizList?.filter(
    (quiz) =>
      quiz?.quiz_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz?.quiz_category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz?.difficulty_level?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <div>
        <h2>Quiz List</h2>
        <div className="form-group">
          <TextField
            type="text"
            variant="outlined"
            placeholder="Search Quiz"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            fullWidth
            sx={{ mb: 2 }}
          />
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Quiz Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Difficulty Level</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQuizList.map((quiz) => (
                <TableRow key={quiz.quiz_id}>
                  <TableCell>{quiz.quiz_name}</TableCell>
                  <TableCell>{quiz.quiz_category}</TableCell>
                  <TableCell>{quiz.difficulty_level}</TableCell>
                  <TableCell>{quiz.start_date}</TableCell>
                  <TableCell>{quiz.end_date}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditGame(quiz.quiz_id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="success"
                      onClick={() => handleViewQuestions(quiz.quiz_id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteGame(quiz.quiz_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal isOpen={isModalOpen} onRequestClose={handleModalClose}>
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>
              &times;
            </span>
            {questions.length > 0 ? (
              <>
                <h2>Quiz Questions</h2>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Question Text</th>
                      <th>Category</th>
                      <th>Options</th>
                      <th>Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question) => (
                      <tr key={question.question_id}>
                        <TableCell>{question.question_text}</TableCell>
                        <TableCell>{question.category}</TableCell>
                        <TableCell>
                          <ul>
                            <li>{question.option1}</li>
                            <li>{question.option2}</li>
                            <li>{question.option3}</li>
                            <li>{question.option4}</li>
                          </ul>
                        </TableCell>
                        <TableCell>{question.answer}</TableCell>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <>
                <h2>Edit Quiz</h2>
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <TextField
                      label="Quiz Name"
                      type="text"
                      name="quizName"
                      value={editFormData.quizName}
                      onChange={handleFormChange}
                      fullWidth
                      variant="outlined"
                    />
                  </div>
                  <div className="form-group">
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="quizCategory"
                        value={editFormData.quizCategory}
                        onChange={handleFormChange}
                        label="Category"
                      >
                        <MenuItem value="">
                          <em>Select Category</em>
                        </MenuItem>
                        <MenuItem value="General Knowledge">General Knowledge</MenuItem>
                        <MenuItem value="Sports">Sports</MenuItem>
                        <MenuItem value="History">History</MenuItem>
                        <MenuItem value="Science">Science</MenuItem>
                        {/* Add more categories here as needed */}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="form-group">
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Difficulty Level</InputLabel>
                      <Select
                        name="difficultyLevel"
                        value={editFormData.difficultyLevel}
                        onChange={handleFormChange}
                        label="Difficulty Level"
                      >
                        <MenuItem value="">
                          <em>Select Difficulty Level</em>
                        </MenuItem>
                        <MenuItem value="Easy">Easy</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Hard">Hard</MenuItem>
                        {/* Add more difficulty levels here as needed */}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="form-group">
                    <DatePicker
                      selected={editFormData.startDate}
                      onChange={(date) => handleDateChange("startDate", date)}
                      fullWidth
                      label="Start Date"
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select Start Date"
                      variant="outlined"
                    />
                  </div>
                  <div className="form-group">
                    <DatePicker
                      selected={editFormData.endDate}
                      onChange={(date) => handleDateChange("endDate", date)}
                      fullWidth
                      label="End Date"
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select End Date"
                      variant="outlined"
                    />
                  </div>
                  <div className="form-group">
                    <TextField
                      label="Total Points"
                      type="number"
                      name="totalPoints"
                      value={editFormData.totalPoints}
                      onChange={handleFormChange}
                      fullWidth
                      variant="outlined"
                    />
                  </div>
                  <div className="form-group">
                    <TextField
                      label="Quiz Description"
                      name="quizDescription"
                      value={editFormData.quizDescription}
                      onChange={handleFormChange}
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                    />
                  </div>
                  <div className="form-group">
                    <TextField
                      label="Total Number of Questions"
                      type="number"
                      name="totalNumQuestions"
                      value={editFormData.totalNumQuestions}
                      onChange={handleFormChange}
                      fullWidth
                      variant="outlined"
                    />
                  </div>
                  <div className="form-group">
                    <Button type="submit" variant="contained" color="primary">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </Modal>
      </div>
    </ThemeProvider>
  );
};

export default QuizList;
