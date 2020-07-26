// helpers
const isEmpty = (str) => {
	return !str.trim();
};

const isEmail = (email) => {
	const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return !!email.match(emailRegEx);
};

exports.validateSignupData = (data) => {
	const errors = {};

	if (isEmpty(data.email)) {
		errors.email = 'Email must not be empty';
	} else if (!isEmail(data.email)) {
		errors.email = 'Must be a valid email address ' + data.email;
	}

	if (isEmpty(data.password)) errors.password = 'Must not be empty';
	if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match';
	if (isEmpty(data.handle)) errors.handle = 'Handle must not be empty';

	return {
		errors,
		valid: !Object.keys(errors).length
	};
};

exports.validateLoginData = (data) => {
	const errors = {};

	if (isEmpty(data.email)) errors.email = 'Email must not be empty';
	if (isEmpty(data.password)) errors.password = 'Must not be empty';

	return {
		errors,
		valid: !Object.keys(errors).length
	};
};

exports.reduceUserDetails = (data) => {
	const userDetails = {};

	if (data.bio && !isEmpty(data.bio.trim())) userDetails.bio = data.bio;
	if (data.website && !isEmpty(data.website.trim())) {
		userDetails.website = !~data.website.indexOf('http')
			? `http://${data.website.trim()}`
			: data.website;
	}
	if (data.location && !isEmpty(data.location.trim())) userDetails.location = data.location;

	return userDetails;
};
