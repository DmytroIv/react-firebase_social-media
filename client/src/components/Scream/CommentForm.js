import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions';
// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const styles = (theme) => ({
	...theme.spreadIt
});

const CommentForm = ({ classes, UI: { errors }, authenticated, screamId, submitComment }) => {
	const [body, setBody] = useState('');
	const [errorsState, setErrorsState] = useState({});

	useEffect(() => {
		setErrorsState({ ...errors });
		if (!errors) {
			setBody('');
			setErrorsState({});
		}
	}, [errors]);

	const handleChange = (e) => {
		const value = e.target.value;
		setBody(value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		submitComment(screamId, { body });
	};

	const commentFormMarkup = authenticated ? (
		<Grid item sm={12} style={{ textAlign: 'center' }}>
			<form onSubmit={handleSubmit}>
				<TextField
					name="body"
					type="text"
					label="Comment on scream"
					error={!!errorsState.comment}
					helperText={errorsState.comment}
					value={body}
					onChange={handleChange}
					fullWidth
					className={classes.textField}
				/>
				<Button type="submit" variant="contained" color="primary" className={classes.button}>
					Submit
				</Button>
			</form>
			<hr className={classes.visibleSeparator} />
		</Grid>
	) : null;
	return commentFormMarkup;
};

CommentForm.propTypes = {
	classes: PropTypes.object.isRequired,
	submitComment: PropTypes.func.isRequired,
	UI: PropTypes.object.isRequired,
	authenticated: PropTypes.bool.isRequired,
	screamId: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
	authenticated: state.user.authenticated,
	UI: state.UI
});

const mapActionsToState = { submitComment };

export default connect(mapStateToProps, mapActionsToState)(withStyles(styles)(CommentForm));
