import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Path from './constants/path';
import Login from './pages/authentication/login';
import MfaQuestions from './pages/MFAPage/mfaQuestions';
import LandingPage from './pages/landingPage/landingPage';
import Update from './components/userDetails/update';
import Lobby from './components/home/homePage';
import SignUp from './pages/authentication/signUp';
import VerificationCode from './pages/authentication/verificationCode';
import MfaQuestionVerification from './pages/MFAPage/mfaQuestionVerification';
import Profile from './pages/profile/profile';
import SignUpGoogle from './pages/authentication/signUpGoogle';
import ForgotPass from './pages/authentication/forgotPass';
import ResetPass from './pages/authentication/resetPass';
import QuizLobby from './pages/quiz_selection/quizLobby';
import QuizPage from './pages/quiz_selection/quizPage';
import TeamHome from "./pages/team_management/team_home";
import TeamInvite from "./pages/team_management/team_invite";
import Leaderboard from "./pages/leaderboard/leaderboardcomp";
import Home from './components/home/homePage';
import { ToastContainer } from 'react-toastify';
import TriviaAdmin from './pages/trivia_admin/AdminPanel';

function App() {
	return (
		<>
			<Routes>
				<Route
					path={Path.HOME}
					element={<LandingPage />}
				/>
				<Route
					path={Path.MFAQUESTIONS}
					element={<MfaQuestions />}
				/>
				<Route
					path={Path.SIGNUP}
					element={<SignUp />}
				/>
				<Route
					path={Path.VERIFICATIONCODE}
					element={<VerificationCode />}
				/>
				<Route
					path={Path.LOGIN}
					element={<Login />}
				/>
				<Route
					path={Path.AFTERLOGIN}
					element={<MfaQuestionVerification />}
				/>
				<Route
					path={Path.PROFILE}
					element={<Profile />}
				/>
				<Route
					path={Path.SIGNUPAFTERGOOGLE}
					element={<SignUpGoogle />}
				/>
				<Route
					path={Path.FORGOTPASS}
					element={<ForgotPass />}
				/>
				<Route
					path={Path.RESETPASS}
					element={<ResetPass />}
				/>
				<Route
					path={Path.QUIZLOBBY}
					element={<QuizLobby />}
				/>
				<Route
					path={Path.QUIZWITHID}
					element={<QuizPage />}
				/>
				<Route
					path={Path.USERDETAILS}
					element={<Update />}
				/>
				<Route
					path={Path.GAMELOBBY}
					element={<Lobby />}
				/>
				<Route
					path={Path.ADMINPANEL}
					element={<TriviaAdmin />}
				/>
				<Route 
					path={Path.TEAMHOME} 
					element={<TeamHome />} 
				/>
        		<Route 
					path={Path.TEAMINVITE} 
					element={<TeamInvite/>} 
				/>
        		<Route 
					path={Path.LEADERBOARD} 
					element={<Leaderboard/>} 
				/>
			</Routes>
			<ToastContainer position="top-center" />
		</>
	);
}

export default App;
