import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// Redux
import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';
// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
// Components
import Scream from '../components/Scream/Scream';
import StaticProfile from '../components/Profile/StaticProfile';
import ProfileSkeleton from '../util/ProfileSkeleton';

const styles = (theme) => ({
	...theme.spreadIt
});

const User = ({ match, getUserData, data: { screams, loading } }) => {
	const [profile, setProfile] = useState(null);
	const [screamIdParam, setScreamIdParam] = useState(null);

	useEffect(() => {
		const handle = match.params.handle;
		const screamId = match.params.screamId;

		if (screamId) setScreamIdParam(screamId);

		getUserData(handle);
		axios
			.get(`/user/${handle}`)
			.then((res) => {
				setProfile(res.data.user);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [getUserData, match.params.handle, match.params.screamId]);

	const screamsMarkup = loading ? (
		<p>Loading...</p>
	) : !screams ? (
		<p>No screams form this user</p>
	) : !screamIdParam ? (
		screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
	) : (
		screams.map((scream) => {
			if (scream.screamId !== screamIdParam)
				return <Scream key={scream.screamId} scream={scream} />;
			return <Scream key={scream.screamId} scream={scream} openDialog />;
		})
	);

	return (
		<Grid container spacing={2}>
			<Grid item sm={8} xs={12}>
				{screamsMarkup}
			</Grid>
			<Grid item sm={4} xs={12}>
				{!profile ? <ProfileSkeleton /> : <StaticProfile profile={profile} />}
			</Grid>
		</Grid>
	);
};

User.propTypes = {
	classes: PropTypes.object.isRequired,
	getUserData: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	data: state.data
});

const mapActionsToState = { getUserData };

export default connect(mapStateToProps, mapActionsToState)(withStyles(styles)(User));
