import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

// img
import appIcon from '../images/icon.png';

const styles = (theme) => ({
	...theme.spreadIt
});

const Login = ({ classes, history, loginUser, UI: { loading } }) => {
	const [errors] = useState({});

	const [userDetails, setUserDetails] = useState({
		email: '',
		password: ''
	});

	const handleSubmit = (e) => {
		e.preventDefault();

		const userData = {
			email: userDetails.email,
			password: userDetails.password
		};

		loginUser(userData, history);
	};

	const handleChange = (e) => {
		const value = e.target.value;
		const inputName = e.target.name;
		setUserDetails((prevstate) => ({ ...prevstate, [inputName]: value }));
	};

	return (
		<Grid container className={classes.form}>
			<Grid item sm></Grid>
			<Grid item sm>
				<img src={appIcon} alt="app" className={classes.image} />
				<Typography variant="h2" className={classes.pageTitle}>
					Login
				</Typography>
				<form noValidate onSubmit={handleSubmit}>
					<TextField
						id="email"
						name="email"
						type="email"
						label="Email"
						className={classes.textField}
						value={userDetails.email}
						onChange={handleChange}
						fullWidth
						helperText={errors.email}
						error={!!errors.email}
					/>
					<TextField
						id="password"
						name="password"
						type="password"
						label="Password"
						className={classes.textField}
						value={userDetails.password}
						onChange={handleChange}
						fullWidth
						helperText={errors.password}
						error={!!errors.password}
					/>
					{errors.general && (
						<Typography variant="body2" className={classes.customError}>
							{errors.general}
						</Typography>
					)}
					<Button
						type="submit"
						variant="contained"
						color="primary"
						className={classes.button}
						disabled={loading}
					>
						Login
						{loading && <CircularProgress size={30} className={classes.progress} />}
					</Button>
					<br />
					<small>
						dont have an account ? sign up <Link to="/signup">here</Link>
					</small>
				</form>
			</Grid>
			<Grid item sm></Grid>
		</Grid>
	);
};

Login.propTypes = {
	classes: PropTypes.object.isRequired,
	loginUser: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	user: state.user,
	UI: state.UI
});

const mapActionsToProps = {
	loginUser
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Login));
