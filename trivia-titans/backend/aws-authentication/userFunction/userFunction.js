//Fetch name and email from cofnito user data response
exports.getUser = (params) => {
	let user = {
		id: '',
		email: '',
	};

	params.map((val, index) => {
		if (val.Name === 'sub') {
			user.id = val.Value;
		}

		if (val.Name === 'email') {
			user.email = val.Value;
		}
	});

	return user;
};
