const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider();

//Call cognito's signup method and add user to cognito user pool
exports.createUser = async (params) => {
	try {
		const response = await cognito.signUp(params).promise();
		return response;
	} catch (error) {
		if (error.code === 'UsernameExistsException') {
			return 'user alreay exists!!';
		}
		if (error.code === 'ValidationException') {
			return 'Password does not match requirements!!';
		} else {
			return 'Error signing up the user';
		}
	}
};

//Call cognito's confirm signup method to confirm user email
exports.verifyEmail = async (params) => {
	return cognito.confirmSignUp(params).promise();
};

// Call cognito's initiate auth  method to perform email and password verification
exports.login = async (params) => {
	return cognito.initiateAuth(params).promise();
};

//Call cognito's get user method to get details of user with given email id
exports.getUserData = async (params) => {
	return cognito.getUser(params).promise();
};

//Call cognito's global signout method to sign user out and make accesstoken invalid
exports.signout = async (params) => {
	return cognito.globalSignOut(params).promise();
};

//Call cognito's adminUpdateUserAttributes method to update user logged in with social media accounts
exports.verifyEmailWithoutOTP = async (params) => {
	return cognito.adminUpdateUserAttributes(params).promise();
};

//Call cognito's adminConfirmSignUp method to confirm user logged in with social media accounts
exports.adminConfirmSignUp = async (params) => {
	return cognito.adminConfirmSignUp(params).promise();
};

//Call cognito's forgot password method to reser pasword of user
exports.forgotPassword = async (params) => {
	return cognito.forgotPassword(params).promise();
};

//Call cognito's confirm password method to verift confirmation code and new password
exports.confirmUserPasswordToReset = (params) => {
	return cognito.confirmForgotPassword(params).promise();
};
