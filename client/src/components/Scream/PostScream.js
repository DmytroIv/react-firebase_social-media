import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';
import { postScream, clearErrors } from '../../redux/actions/dataActions';
// Components
import MyButton from '../../util/MyButton';
// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => ({
	...theme.spreadIt,
	submitButton: {
		position: 'relative',
		float: 'right',
		marginTop: 10
	},
	progressSpinner: {
		position: 'absolute'
	},
	closeButton: {
		position: 'absolute',
		left: '91%',
		top: '6%'
	}
});

const PostScream = ({ UI: { loading, errors }, classes, postScream, clearErrors }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [errorsState, setErrorsState] = useState({});
	const [body, setBody] = useState('');

	useEffect(() => {
		setErrorsState({ ...errors });

		if (!errors && !loading) {
			setBody('');
			setIsOpen(false);
			setErrorsState({});
		}
	}, [errors, loading]);

	const handleOpen = () => {
		setIsOpen(true);
	};

	const handleClose = () => {
		clearErrors();
		setIsOpen(false);
		setErrorsState({});
	};

	const handleChange = (e) => {
		const value = e.target.value;
		setBody(value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		clearErrors();
		postScream({ body });
	};

	return (
		<>
			<MyButton tip="Post a Scream !" onClick={handleOpen}>
				<AddIcon color="primary" />
			</MyButton>

			<Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
				<MyButton tip="Close" onClick={handleClose} tipClassName={classes.closeButton}>
					<CloseIcon />
				</MyButton>
				<DialogTitle>Post a new scream</DialogTitle>
				<DialogContent>
					<form onSubmit={handleSubmit}>
						<TextField
							name="body"
							type="text"
							label="Scream!!!"
							multiline
							rows="3"
							placeholder="Scream at your fellow apes"
							error={!!errorsState.body}
							helperText={errorsState.body}
							className={classes.TextField}
							value={body}
							onChange={handleChange}
							fullWidth
						/>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							className={classes.submitButton}
							disabled={loading}
						>
							Submit
							{loading && <CircularProgress size={30} className={classes.progressSpinner} />}
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

PostScream.propTypes = {
	postScream: PropTypes.func.isRequired,
	clearErrors: PropTypes.func.isRequired,
	UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	UI: state.UI
});

const mapActionsToState = { postScream, clearErrors };

export default connect(mapStateToProps, mapActionsToState)(withStyles(styles)(PostScream));
