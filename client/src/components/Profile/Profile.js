import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
// Redux
import { connect } from 'react-redux';
import { logoutUser, uploadImage } from '../../redux/actions/userActions';
// Components
import EditDetails from './EditDetails';
import MyButton from '../../util/MyButton';
// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

const styles = (theme) => ({
	...theme.spreadIt
});

const Profile = ({
	user: {
		credentials: { handle, createdAt, imageUrl, bio, website, location },
		loading,
		authenticated
	},
	classes,
	uploadImage,
	logoutUser
}) => {
	const imageInput = useRef();

	const handleImageChange = (e) => {
		const image = e.target.files[0];
		const formData = new FormData();
		formData.append('image', image, image.name);
		uploadImage(formData);
	};

	const hangelEditPicture = () => {
		imageInput.current.click();
	};

	const handleLogout = () => {
		logoutUser();
	};

	let profileMarkup = <p>loading</p>;
	if (!loading) {
		if (authenticated) {
			profileMarkup = (
				<Paper className={classes.paper}>
					<div className={classes.profile}>
						<div className="image-wrapper">
							<img src={imageUrl} alt="profile" className="profile-image" />
							<input type="file" ref={imageInput} onChange={handleImageChange} hidden="hidden" />
							<MyButton
								onClick={hangelEditPicture}
								tip="Eddit profile picture"
								btnClassName="button"
							>
								<EditIcon color="primary" />
							</MyButton>
						</div>
						<hr />
						<div className="profile-details">
							<MuiLink component={Link} to={`/users/${handle}`} color="primary" variant="h5">
								@{handle}
							</MuiLink>
							<hr />
							{bio && <Typography variant="body2">{bio}</Typography>}
							<hr />
							{location && (
								<>
									<LocationOnIcon color="primary" /> <span>{location}</span>
									<hr />
								</>
							)}
							{website && (
								<>
									<LinkIcon color="primary" />{' '}
									<a href={website} target="_blank" rel="noopener noreferrer">
										{' '}
										{website}
									</a>
									<hr />
								</>
							)}
							<CalendarToday color="primary" />
							&nbsp;
							<span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
						</div>
						<MyButton onClick={handleLogout} tip="Logout">
							<KeyboardReturn color="primary" />
						</MyButton>
						<EditDetails />
					</div>
				</Paper>
			);
		} else {
			profileMarkup = (
				<Paper className={classes.paper}>
					<Typography variant="body2" align="center">
						No profile found
					</Typography>
					<div className={classes.buttons}>
						<Button variant="contained" color="primary" component={Link} to="/login">
							Login
						</Button>
						<Button variant="contained" color="secondary" component={Link} to="/signup">
							SignUp
						</Button>
					</div>
				</Paper>
			);
		}
	}

	return profileMarkup;
};

Profile.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	uploadImage: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	user: state.user
});

const mapActionsToState = {
	logoutUser,
	uploadImage
};

export default connect(mapStateToProps, mapActionsToState)(withStyles(styles)(Profile));
