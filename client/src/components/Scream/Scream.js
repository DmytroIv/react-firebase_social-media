import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';
// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ChatIcon from '@material-ui/icons/Chat';
// Components
import MyButton from '../../util/MyButton';
import DeleteScream from './DeleteScream';
import ScreamDialog from './ScreamDialog';
import LikeButton from './LikeButton';

const styles = {
	card: {
		display: 'flex',
		marginBottom: 20,
		position: 'relative'
	},
	image: {
		minWidth: 200,
		objectfit: 'cover'
	},
	content: {
		padding: 25
	}
};

const Scream = ({
	openDialog,
	user,
	scream: {
		screamId,
		image,
		userImage,
		content,
		userHandle,
		createdAt,
		body,
		likeCount,
		commentCount
	},
	classes
}) => {
	dayjs.extend(relativeTime);

	const daleteButton =
		user.authenticated && userHandle === user.credentials.handle ? (
			<DeleteScream screamId={screamId} />
		) : null;

	return (
		<Card className={classes.card}>
			<CardMedia image={userImage} title="Profile image" className={classes.image} />
			<CardContent className={classes.content}>
				<Typography variant="h5" component={Link} to={`/users/${userHandle}`} color="primary">
					{userHandle}
				</Typography>
				{daleteButton}
				<Typography variant="body2" color="textSecondary">
					{dayjs(createdAt).fromNow()}
				</Typography>
				<Typography variant="body1">{body}</Typography>
				<LikeButton screamId={screamId} />
				<span>{likeCount} Likes</span>
				<MyButton tip="Comments">
					<ChatIcon color="primary" />
				</MyButton>
				<span>{commentCount} Comments</span>
				<ScreamDialog screamId={screamId} userHandle={userHandle} openDialog={openDialog} />
			</CardContent>
		</Card>
	);
};

Scream.propTypes = {
	user: PropTypes.object.isRequired,
	scream: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
	openDialog: PropTypes.bool
};

const mapStateToProps = (state) => ({
	user: state.user
});

export default connect(mapStateToProps, null)(withStyles(styles)(Scream));
