import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';
import { editUserDetails } from '../../redux/actions/userActions';
// Components
import MyButton from '../../util/MyButton';
// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';

const styles = (theme) => ({
	...theme.spreadIt,
	button: {
		float: 'right'
	}
});

const EditDetails = ({ credentials, classes, editUserDetails }) => {
	const [userDetails, setUserDetails] = useState({
		bio: '',
		website: '',
		location: ''
	});
	const [isOpen, setIsOpen] = useState(false);

	const mapUserDetailsToState = useCallback(() => {
		const { bio, website, location } = credentials;
		setUserDetails({
			bio: bio || '',
			website: website || '',
			location: location || ''
		});
	}, [credentials]);

	useEffect(() => {
		mapUserDetailsToState();
	}, [mapUserDetailsToState]);

	const handleOpen = () => {
		setIsOpen(true);

		mapUserDetailsToState();
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleChange = (e) => {
		const value = e.target.value;
		const inputName = e.target.name;
		setUserDetails((prevstate) => ({ ...prevstate, [inputName]: value }));
	};

	const handleSubmit = () => {
		const newUserDetails = {
			bio: userDetails.bio,
			website: userDetails.website,
			location: userDetails.location
		};

		editUserDetails(newUserDetails);
		handleClose();
	};

	return (
		<>
			<MyButton onClick={handleOpen} tip="Edit details" btnClassName={classes.button}>
				<EditIcon color="primary" />
			</MyButton>

			<Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
				<DialogTitle>Edit your details</DialogTitle>
				<DialogContent>
					<form>
						<TextField
							name="bio"
							type="text"
							label="Bio"
							multiline
							rows="3"
							placeholder="A short name about yourself"
							className={classes.TextField}
							value={userDetails.bio}
							onChange={handleChange}
							fullWidth
						/>
						<TextField
							name="website"
							type="text"
							label="Website"
							placeholder="Your personal/profesional website"
							className={classes.TextField}
							value={userDetails.website}
							onChange={handleChange}
							fullWidth
						/>
						<TextField
							name="location"
							type="text"
							label="Location"
							placeholder="Where you live"
							className={classes.TextField}
							value={userDetails.location}
							onChange={handleChange}
							fullWidth
						/>
					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

EditDetails.propTypes = {
	editUserDetails: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
	credentials: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	credentials: state.user.credentials
});

const mapActionsToProps = {
	editUserDetails
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(EditDetails));
