const Path = {
	HOME: '/',
	COGNITO:
		'https://trivia-titans.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=38hd6md853jaij8k0nna33921k&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fgoogle.com',
	MFAQUESTIONS: '/mfa',
	LOGIN: '/login',
	SIGNUP: '/signup',

	REGISTER: '/register',
	USERDETAILS: '/userdetails',
	GAMELOBBY: '/lobby',

	AFTERLOGIN: '/afterlogin',
	VERIFICATIONCODE: '/verification_code',
	PROFILE: '/profile',
	SIGNUPAFTERGOOGLE: '/signupAfterGoogle',
	FORGOTPASS: '/forgot_pass',
	RESETPASS: '/reset_password',
	QUIZLOBBY: '/quiz_lobby',
	QUIZWITHID: '/quiz/:quizId',
	ADMINPANEL: '/admin_panel',
	TEAMHOME: '/team_home',
	TEAMINVITE: '/team_invite/:data',
	LEADERBOARD: '/leaderboard',
};

export default Path;
