import axios from 'axios';
import APIS from '../apis.json';

const api = axios.create();

api.interceptors.request.use(
	async (params) => {
		const accessToken = localStorage.getItem('ACCESS_TOCKEN');
		const lambdaAPI =
			APIS['aws-lambda-api-authentication'] + '/verifyAccessToken';

		if (accessToken) {
			const user = await axios.post(lambdaAPI, {
				accessToken,
			});
			console.log(user.data);

			// User is not authorized
			if (user.data?.error?.code === 'NotAuthorizedException') {
				localStorage.clear();
				window.location.href = '/login';
			} else {
				params.headers.Authorization = `${accessToken}`;
			}
		} else {
			//clear local storage and redirect to login
			localStorage.clear();
			window.location.href = '/login';
		}
		return params;
	},
	(error) => {
		console.error(error);
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(res) => {
		//USer not logged in
		console.log(res.data);
		if (res.data?.userLoginrequired) {
			localStorage.clear();
			alert('Login needed');
			window.location.href = '/login';
		}
		return res;
	},
	(error) => {
		console.error('Interceptor res error:', error);
		return Promise.reject(error);
	}
);

export default api;
