const Service = require('../service/services');
const GetUser = require('../userFunction/userFunction');
require('dotenv').config();

//Create user with details given in body parameters
exports.createUser = async (req, res) => {
	try {
		const params = {
			ClientId: process.env.CLIENTID,
			Username: req.body.email,
			Password: req.body.password,
			UserAttributes: [{ Name: 'email', Value: req.body.email }],
		};
		const response = await Service.createUser(params);
		if (response === 'user alreay exists!!') {
			res.status(404).send(response);
		} else if (response === 'Error signing up the user!!') {
			res.status(404).send(response);
		} else {
			res.status(200).send(response);
		}
	} catch (error) {
		res.status(500).send(error);
	}
};

//Verify user email address with given confirmation code
exports.verifyEmail = async (req, res) => {
	try {
		const params = {
			ClientId: process.env.CLIENTID,
			ConfirmationCode: req.body.ConfirmationCode,
			Username: req.body.email,
		};

		const response = await Service.verifyEmail(params);
		if (!response.error) {
			res.status(200).send({ message: 'Email verified Successfully!' });
		} else {
			res.status(404).send(response);
		}
	} catch (error) {
		const errorResponse = {
			message: 'Server Error(500)',
			error,
		};
		res.status(500).send(errorResponse);
	}
};

//Verify user with given email and password and return access token if Legit user
exports.userLogin = async (req, res) => {
	try {
		const params = {
			AuthFlow: 'USER_PASSWORD_AUTH',
			ClientId: process.env.CLIENTID,
			AuthParameters: {
				USERNAME: req.body.email,
				PASSWORD: req.body.password,
			},
		};
		const response = await Service.login(params);
		res.cookie('AccessToken', response?.AuthenticationResult?.AccessToken);
		if (response?.AuthenticationResult?.AccessToken) {
			const params = {
				AccessToken: response?.AuthenticationResult?.AccessToken,
			};
			const userResponse = await Service.getUserData(params);
			var user = GetUser.getUser(userResponse.UserAttributes);
		}
		const responseMessage = {
			user,
			authenticationDetails: response,
		};
		if (!user) {
			res.status(404).message('Password not matched');
		}
		res.status(200).send(responseMessage);
	} catch (error) {
		const errorResponse = {
			message: 'Server Error(500)',
			error,
		};
		res.status(404).send(errorResponse);
	}
};

//Verufy access tocken provided by user
exports.verifyUserAccessToken = async (req, res) => {
	try {
		const params = {
			AccessToken: req.body.accessToken,
		};
		const responseFromAWS = await Service.getUserData(params);
		if (!res.error) {
			const user = GetUser.getUser(responseFromAWS.UserAttributes);
			res.send(user);
		} else {
			const error = {
				message: 'User is not authorized.',
				userLoginrequired: true,
			};
			res.send(error);
		}
	} catch (error) {
		res.send(error);
	}
};

//Receive Access tocken and perform Sign out.
exports.signout = async (req, res) => {
	try {
		const params = {
			AccessToken: req.body.AccessToken,
		};
		const response = await Service.signout(params);
		if (!response.error) {
			res.status(200).send({ message: 'Signed Out!!!' });
		} else {
			res.status(404).send(response);
		}
	} catch (error) {
		const errorResponse = {
			message: 'Server Error(500)',
			error,
		};
		res.status(500).send(errorResponse);
	}
};

//Perform forgot password for user with received emailid and send confirmation code
exports.forgotUserPassword = async (req, res) => {
	try {
		const params = {
			ClientId: process.env.CLIENTID,
			Username: req.body.email,
		};

		const response = await Service.forgotPassword(params);
		if (!response.error) {
			res.status(200).send({
				message:
					'reset password code has been sent to your email. Enter this code in next step.',
			});
		} else {
			res.status(404).send(response);
		}
	} catch (error) {
		const errorResponse = {
			message: 'Server Error(500)',
			error,
		};
		res.status(500).send(errorResponse);
	}
};

//Reset password after validating confirmatio code
exports.confirmUserPasswordReset = async (req, res) => {
	try {
		const params = {
			ClientId: process.env.CLIENTID,
			ConfirmationCode: req.body.otp,
			Password: req.body.newPassword,
			Username: req.body.email,
		};

		const response = await Service.confirmUserPasswordToReset(params);
		if (!response.error) {
			res.status(200).send({ message: 'Password has been reset!!' });
		} else {
			res.status(404).send(response);
		}
	} catch (error) {
		const errorResponse = {
			message: 'Server Error(500)',
			error,
		};
		res.status(500).send(errorResponse);
	}
};

//Verify email address with confirmation code --> This is for users logging in with Third party social media accounts such as Google and Facebook
exports.verifyEmailWithoutOTP = async (req, res) => {
	try {
		const params = {
			ClientId: process.env.CLIENTID,
			Username: req.body.email,
			Password: 'Google-ase87634tr8fwe-fueve7634t8gr79f4ebwh',
			UserAttributes: [{ Name: 'email', Value: req.body.email }],
		};
		const response = await Service.createUser(params);
		if (response === 'user alreay exists!!') {
			res.status(404).send(response);
		} else if (response === 'Error signing up the user!!') {
			res.status(404).send(response);
		} else {
			try {
				const userData = {
					UserPoolId: process.env.USERPOOLID,
					Username: req.body.email,
					UserAttributes: [{ Name: 'email_verified', Value: 'true' }],
				};

				const cognitoResponse = await Service.verifyEmailWithoutOTP(userData);
				if (!cognitoResponse.error) {
					const userData = {
						UserPoolId: process.env.USERPOOLID,
						Username: req.body.email,
					};
					await Service.adminConfirmSignUp(userData);
					res.send({
						message: 'user Email confirmed without OTP.',
						success: true,
					});
				} else {
					res.send({ success: false, response: cognitoResponse });
				}
			} catch (error) {
				res.send(error);
			}
		}
	} catch (error) {
		res.status(500).send(error);
	}
};
