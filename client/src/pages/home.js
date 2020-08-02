import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';
import { getScreams } from '../redux/actions/dataActions';
// MUI
import Grid from '@material-ui/core/Grid';
// components
import Scream from '../components/Scream/Scream';
import Profile from '../components/Profile/Profile';
import ScreamsSkeleton from '../util/ScreamsSkeleton';

const Home = ({ getScreams, data: { screams, loading } }) => {
	useEffect(() => {
		getScreams();
	}, [getScreams]);

	const recentScreamsMarkup =
		!loading && screams ? (
			screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
		) : (
			<ScreamsSkeleton />
		);

	return (
		<Grid container spacing={2}>
			<Grid item sm={8} xs={12}>
				{recentScreamsMarkup}
			</Grid>
			<Grid item sm={4} xs={12}>
				<Profile />
			</Grid>
		</Grid>
	);
};

Home.propTypes = {
	data: PropTypes.object.isRequired,
	getScreams: PropTypes.func.isRequired
};

const mapActionsToProps = {
	getScreams
};

const mapStateToProps = (state) => ({
	data: state.data
});

export default connect(mapStateToProps, mapActionsToProps)(Home);
