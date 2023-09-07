import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../../apis.json';
import {
	Container,
	Typography,
	Button,
	Card,
	CardContent,
	CardActions,
	Grid,
	Divider,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './quizPage.css';

const theme = createTheme();

function QuizDetails() {
	const navigate = useNavigate();
	const { quizId } = useParams();
	const [quizData, setQuizData] = useState({});
	const [isAdmin, setIsAdmin] = useState(false);
	const [timeDifference, setTimeDifference] = useState('');
	const [teamArray, setTeamArray] = useState([]);
	const [quizEnded, setQuizEnded] = useState(false);

	const calculateTimeDifference = (inputDate) => {
		if (!inputDate) {
			return;
		}

		const inputDateTime = new Date(inputDate).getTime();
		const currentDateTime = new Date().getTime();
		const timeDifferenceMillis = inputDateTime - currentDateTime;
		const timeDifferenceInSeconds = Math.floor(timeDifferenceMillis / 1000);

		const days = Math.floor(timeDifferenceInSeconds / (60 * 60 * 24));
		const hours = Math.floor(
			(timeDifferenceInSeconds % (60 * 60 * 24)) / (60 * 60)
		);
		const minutes = Math.floor((timeDifferenceInSeconds % (60 * 60)) / 60);
		const seconds = timeDifferenceInSeconds % 60;

		setTimeDifference(
			`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
		);

		if (timeDifferenceInSeconds <= 0) {
			setQuizEnded(true);
		}
	};
	const verifyLogin = () => {
		const token = window.localStorage.getItem('ACCESS_TOCKEN');
		if (!token) {
			alert('Please Login!!');
			navigate('/login');
		}
	};

	useEffect(() => {
		verifyLogin();
		const quizAPI = API['quiz-lambda-function-url'] + '/all_quiz/' + quizId;
		const fetchQuizData = async () => {
			try {
				const response = await axios.get(quizAPI);
				setQuizData(response.data);
				calculateTimeDifference(response.data.end_date);
			} catch (error) {
				console.error('Error fetching quiz:', error);
			}
		};

		const fetchAdmin = async () => {
			try {
				const adminCheckAPI = API['aws-fetch-team-member-api'];
				const email_id = window.localStorage.getItem(
					'LOGGED_IN_USER_USER_EMAIL'
				);
				const emailOfUser = { email_id };
				await axios
					.post(adminCheckAPI, emailOfUser)
					.then((response) => {
						if (response.data.statusCode === 200) {
							setIsAdmin(true);
							const teamMembersEmails = response.data.body.team_members;
							setTeamArray(teamMembersEmails);
						} else {
							setIsAdmin(true);
						}
					})
					.catch((err) => {
						console.log(err);
					});
			} catch (error) {
				console.error('Error fetching admin:', error);
			}
		};

		fetchQuizData();
		fetchAdmin();

		// eslint-disable-next-line
	}, []);

	const sendInvites = async () => {
		const email_id = window.localStorage.getItem('LOGGED_IN_USER_USER_EMAIL');
		const data = {
			admin_email: email_id,
			quiz_id: quizData.quiz_id,
			quiz_name: quizData.quiz_name,
			team_emails: teamArray,
			difficulty: quizData.difficulty_level,
			Category: quizData.quiz_category,
		};

		const quizAPI = API['aws-send-game-invite-url'];

		try {
			const response = await axios.post(quizAPI, data);
			if (response.status === 200) {
				alert('Invitations sent successfully!');
				console.log(response.data);
			} else {
				alert('Failed to send invitations.');
			}
		} catch (error) {
			console.error('Error sending invitations:', error);
			alert(
				'An error occurred while sending invitations. Please try again later.'
			);
		}
	};

	const handleJoinGame = async () => {
		const LoggedInUser = window.localStorage.getItem(
			'LOGGED_IN_USER_USER_EMAIL'
		);
		const questionAPI =
			API['aws-manil-wuestion-end-point'] +
			'/get_quiz_questions_by_id/' +
			quizId;

		const playerAPI =
			API['aws-manil-wuestion-end-point'] +
			'/add_user_to_quiz?quiz_id=' +
			quizId;

		if (quizEnded) {
			alert('Quiz has ended.');
		} else {
			try {
				await axios
					.post(playerAPI, { user_id: LoggedInUser })
					.then((response) => {
						console.log(response);
					})
					.catch((error) => {
						console.error('Error sending player:', error);
					});
				const response = await axios.get(questionAPI);
				if (response.status === 200) {
					navigate('/lobby', {
						state: {
							isAdmin,
							LoggedInUser,
							teamName: 'titans',
							quizName: quizData.quiz_name,
						},
					});
					alert('Navigating to quiz!!');
				} else {
					console.log('not 200');
				}
			} catch (error) {
				console.error('Error fetching questions:', error);
				alert('An error occurred while fetching questions.');
			}
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<Container className="container-quiz-page">
				<Grid
					container
					spacing={3}
				>
					<Grid
						item
						xs={12}
					>
						<Card>
							<CardContent>
								<Typography variant="h4">Quiz Details</Typography>
								<Divider />
								<Typography variant="body1">Quiz ID: {quizId}</Typography>
								<Typography variant="h5">{quizData.name}</Typography>
								<Typography variant="body1">
									Name: {quizData.quiz_name}
								</Typography>
								<Typography variant="body1">
									Category: {quizData.quiz_category}
								</Typography>
								<Typography variant="body1">
									Difficulty: {quizData.difficulty_level}
								</Typography>
								{quizEnded ? null : (
									<Typography variant="body1">
										Time remaining: {timeDifference}
									</Typography>
								)}
								<Typography variant="body1">
									Description: {quizData.quiz_description}
								</Typography>
								<Typography variant="body1">
									Total points: {quizData.total_points}
								</Typography>
								<div className="join-quiz-div">
									<Button
										variant="contained"
										color="primary"
										className={`join-quiz-button ${
											quizEnded ? 'quiz-ended' : ''
										}`}
										onClick={handleJoinGame}
										disabled={quizEnded}
									>
										{quizEnded ? 'Quiz has ended' : 'Join Quiz'}
									</Button>
								</div>
							</CardContent>
						</Card>
					</Grid>
					{isAdmin ? (
						<Grid
							item
							xs={12}
						>
							<Card>
								<CardContent>
									<Typography variant="h5">Your Team Members</Typography>
									<Divider />
									<div className="team-members-list">
										{teamArray?.map((email, index) => (
											<Typography
												key={index}
												variant="body2"
											>
												{email}
											</Typography>
										))}
									</div>
									{quizEnded ? null : (
										<CardActions>
											<Button
												variant="contained"
												color="primary"
												className="invite-member-button"
												onClick={sendInvites}
											>
												Invite Team Members
											</Button>
										</CardActions>
									)}
								</CardContent>
							</Card>
						</Grid>
					) : null}
					<Grid
						item
						xs={12}
					>
						<Card>
							<CardContent>
								<Typography variant="h5">List of Other Participants</Typography>
								<Divider />
								<div className="team-member-name-div">
									{quizData.players
										? quizData.players.map((player, index) => (
												<Typography
													key={index}
													variant="body2"
												>
													{player}
												</Typography>
										  ))
										: null}
								</div>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</ThemeProvider>
	);
}

export default QuizDetails;
