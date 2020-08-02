import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
// Redux
import { connect } from 'react-redux';
import { getScream, clearErrors } from '../../redux/actions/dataActions';
// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat';
import CloseIcon from '@material-ui/icons/Close';
// Components
import MyButton from '../../util/MyButton';
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';

const styles = (theme) => ({
	...theme.spreadIt,
	profileImage: {
		maxWidth: 200,
		height: 200,
		borderRadius: '50%',
		objectFit: 'cover'
	},
	dialogContent: {
		padding: 20,
		overflowX: 'hidden'
	},
	closeButton: {
		position: 'absolute',
		left: 'calc(90% - 6px)'
	},
	expandButton: {
		position: 'absolute',
		left: '90%'
	},
	spinnerDiv: {
		textAlign: 'center',
		marginTop: 50,
		marginBottom: 50
	}
});

const ScreamDialog = ({
	openDialog,
	getScream,
	clearErrors,
	screamId,
	classes,
	scream: { body, createdAt, likeCount, commentCount, userImage, userHandle, comments },
	UI: { loading }
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [oldPathState, setOldPathState] = useState('');
	const [, setNewPathState] = useState('');

	const handleOpen = useCallback(() => {
		let oldPath = window.location.pathname;

		const newPath = `/users/${userHandle}/scream/${screamId}`;
		window.history.pushState(null, null, newPath);

		if (oldPath === newPath) {
			oldPath = `/users/${userHandle}`;
		}

		setOldPathState(oldPath);
		setNewPathState(newPath);
		setIsOpen(true);
		getScream(screamId);
	}, [screamId, getScream, userHandle]);

	useEffect(() => {
		if (openDialog) {
			handleOpen();
		}
	}, [openDialog, handleOpen]);

	const handleClose = () => {
		setIsOpen(false);
		clearErrors();

		window.history.pushState(null, null, oldPathState);
	};

	const dialogMarkup = loading ? (
		<div className={classes.spinnerDiv}>
			<CircularProgress size={200} thickness={2} />
		</div>
	) : (
		<Grid container spacing={10}>
			<Grid item sm={5}>
				<img src={userImage} alt="Profile" className={classes.profileImage} />
			</Grid>
			<Grid item sm={7}>
				<Typography component={Link} color="primary" variant="h5" to={`/users/${userHandle}`}>
					@{userHandle}
				</Typography>
				<hr className={classes.invisibleSeparator} />
				<Typography variant="body2" color="textSecondary">
					{dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
				</Typography>
				<hr className={classes.invisibleSeparator} />
				<Typography variant="body1">{body}</Typography>
				<LikeButton screamId={screamId} />
				<span>{likeCount} likes</span>
				<MyButton tip="comments">
					<ChatIcon color="primary" />
				</MyButton>
				<span>{commentCount} comments</span>
			</Grid>
			<hr className={classes.visibleSeparator} />
			<CommentForm screamId={screamId} />
			{comments && <Comments comments={comments} />}
		</Grid>
	);

	return (
		<>
			<MyButton onClick={handleOpen} tip="Expand scream" tipClassName={classes.expandButton}>
				<UnfoldMoreIcon color="primary" />
			</MyButton>
			<Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
				<MyButton tip="Close" onClick={handleClose} tipClassName={classes.closeButton}>
					<CloseIcon />
				</MyButton>
				<DialogContent className={classes.dialogContent}>{dialogMarkup}</DialogContent>
			</Dialog>
		</>
	);
};

ScreamDialog.propTypes = {
	getScream: PropTypes.func.isRequired,
	clearErrors: PropTypes.func.isRequired,
	screamId: PropTypes.string.isRequired,
	userHandle: PropTypes.string.isRequired,
	scream: PropTypes.object.isRequired,
	UI: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	scream: state.data.scream,
	UI: state.UI
});

const mapActionsToState = { getScream, clearErrors };

export default connect(mapStateToProps, mapActionsToState)(withStyles(styles)(ScreamDialog));
