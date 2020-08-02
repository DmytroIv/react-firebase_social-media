import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
// Redux
import { connect } from 'react-redux';
// MUI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
// Components
import MyButton from '../../util/MyButton';
import PostScream from '../Scream/PostScream';
import Notifications from './Notifications';

const Navbar = ({ authenticated }) => {
	return (
		<AppBar position="fixed">
			<Toolbar className="nav-container">
				{authenticated ? (
					<>
						<PostScream />
						<NavLink to="/">
							<MyButton tip="Go to home page">
								<HomeIcon color="primary" />
							</MyButton>
						</NavLink>
						<Notifications />
					</>
				) : (
					<>
						<Button component={NavLink} to="/" color="inherit">
							Home
						</Button>
						<Button component={NavLink} to="/login" color="inherit">
							Login
						</Button>
						<Button component={NavLink} to="/signup" color="inherit">
							Signup
						</Button>
					</>
				)}
			</Toolbar>
		</AppBar>
	);
};

Navbar.propTypes = {
	authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
	authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(Navbar);
