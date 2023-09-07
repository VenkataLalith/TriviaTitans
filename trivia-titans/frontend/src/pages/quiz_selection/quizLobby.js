import React, { useState, useEffect } from 'react';
import './quizLobby.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
	ThemeProvider,
	CssBaseline,
	Container,
	Typography,
	Button,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import API from '../../apis.json';

const theme = createTheme();

function QuizLobby() {
	const [quizData, setQuizData] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedDifficulty, setSelectedDifficulty] = useState('');

	useEffect(() => {
		fetchQuizData();
	}, []);

	const fetchQuizData = async () => {
		try {
			const response = await axios.get(
				API['quiz-lambda-function-url'] + '/all_quiz'
			);
			setQuizData(response.data.quizzes);
		} catch (error) {
			console.error('Error fetching quiz:', error);
		}
	};

	const handleShowQuiz = async () => {
		let filterQuizApi = API['quiz-lambda-function-url'] + '/all_quiz';
		if (selectedCategory !== '' || selectedDifficulty !== '') {
			filterQuizApi += `/${selectedDifficulty}/${selectedCategory}`;
		}

		try {
			const response = await axios.get(filterQuizApi);
			setQuizData(response.data.quizzes);
		} catch (error) {
			console.error('Error calling filter API:', error);
		}
	};

	const handleResetFilters = async () => {
		setSelectedCategory('');
		setSelectedDifficulty('');
		fetchQuizData();
	};

	let quizCards = quizData.map((quiz) => (
		<Grid
			item
			xs={12}
			sm={6}
			md={4}
			key={quiz.id}
		>
			<Link
				className="quiz-link-for-another-page"
				to={`/quiz/${quiz.quiz_id}`}
			>
				<div className="quiz-card">
					<h3>{quiz.name}</h3>
					<p>Name: {quiz.quiz_name}</p>
					<p>Category: {quiz.quiz_category}</p>
					<p>Difficulty: {quiz.difficulty_level}</p>
					<p>Players joined: {quiz.players?.length || 0}</p>
				</div>
			</Link>
		</Grid>
	));

	if (quizCards.length === 0) {
		quizCards = (
			<Typography
				variant="body1"
				className="no-quizzes-message"
				style={{
					fontSize: '28px',
					fontWeight: 'bold',
					color: 'red',
					marginTop: '40px',
				}}
			>
				No quizzes available of {selectedCategory} category and{' '}
				{selectedDifficulty} difficulty.
			</Typography>
		);
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Container className="quiz-lobby-container">
				<div className="filter-container">
					<Typography
						variant="h5"
						className="quiz-lobby-title"
					>
						Filters
					</Typography>
					<Grid
						container
						spacing={2}
						className="filter-choices"
					>
						<Grid
							item
							xs={12}
							sm={6}
						>
							<FormControl
								fullWidth
								variant="outlined"
							>
								<InputLabel>Category</InputLabel>
								<Select
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									label="Category"
								>
									<MenuItem value="">All Categories</MenuItem>
									<MenuItem value="General Knowledge">
										General Knowledge
									</MenuItem>
									<MenuItem value="Sports">Sports</MenuItem>
									<MenuItem value="History">History</MenuItem>
									<MenuItem value="Science">Science</MenuItem>
									<MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
						>
							<FormControl
								fullWidth
								variant="outlined"
							>
								<InputLabel>Difficulty</InputLabel>
								<Select
									value={selectedDifficulty}
									onChange={(e) => setSelectedDifficulty(e.target.value)}
									label="Difficulty"
								>
									<MenuItem value="">All Difficulties</MenuItem>
									<MenuItem value="Easy">Easy</MenuItem>
									<MenuItem value="Medium">Medium</MenuItem>
									<MenuItem value="Hard">Hard</MenuItem>
								</Select>
							</FormControl>
						</Grid>
					</Grid>
					<div className="filter-button-div">
						<Button
							variant="contained"
							color="primary"
							className="show-quiz-button"
							onClick={handleShowQuiz}
						>
							Show Selected Quizzes
						</Button>
						<Button
							className="show-quiz-button"
							onClick={handleResetFilters}
						>
							Clear Filters
						</Button>
					</div>
				</div>
				<Typography
					variant="h5"
					className="quiz-lobby-title"
				>
					All Available Quizzes
				</Typography>
				<Grid
					container
					spacing={2}
					className="quiz-cards-container"
				>
					{quizCards}
				</Grid>
			</Container>
		</ThemeProvider>
	);
}

export default QuizLobby;
