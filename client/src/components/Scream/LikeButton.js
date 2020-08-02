import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// Redux
import { connect } from 'react-redux';
import { likeScream, unlikeScream } from '../../redux/actions/dataActions';
// MUI
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
// Components
import MyButton from '../../util/MyButton';

const LikeButton = ({ user, screamId, likeScream, unlikeScream }) => {
	const likedScream = () => !!(user.likes && user.likes.find((like) => like.screamId === screamId));

	const handlelikeScream = () => {
		likeScream(screamId);
	};

	const hangleUnlikeScream = () => {
		unlikeScream(screamId);
	};

	if (!user.authenticated) {
		return (
			<Link to="login">
				<MyButton tip="Like">
					<FavoriteBorderIcon color="primary" />
				</MyButton>
			</Link>
		);
	} else {
		return likedScream() ? (
			<MyButton tip="Undo like" onClick={hangleUnlikeScream}>
				<FavoriteIcon color="primary" />
			</MyButton>
		) : (
			<MyButton tip="Like" onClick={handlelikeScream}>
				<FavoriteBorderIcon color="primary" />
			</MyButton>
		);
	}
};

LikeButton.propTypes = {
	likeScream: PropTypes.func.isRequired,
	unlikeScream: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	screamId: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
	user: state.user
});

const mapActionsToProps = {
	likeScream,
	unlikeScream
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
