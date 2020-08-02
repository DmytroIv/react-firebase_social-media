import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
//
import './App.css';
// MUI
import {
	ThemeProvider as MuiThemeProvider,
	unstable_createMuiStrictModeTheme as createMuiTheme
} from '@material-ui/core/styles';
import themeObject from './util/theme';
// pages
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import User from './pages/user';
// components
import Navbar from './components/Layout/Navbar';
import AuthRoute from './util/AuthRoute';

const theme = createMuiTheme(themeObject);

const token = localStorage.FBIdToken;

if (token) {
	const decodedToken = jwtDecode(token);

	if (decodedToken.exp * 1000 < Date.now()) {
		store.dispatch(logoutUser());
		window.location.href = '/login';
	} else {
		store.dispatch({ type: SET_AUTHENTICATED });
		axios.defaults.headers.common['Authorization'] = token;
		store.dispatch(getUserData());
	}
}

const App = ({ history }) => {
	return (
		<Provider store={store}>
			<MuiThemeProvider theme={theme}>
				<BrowserRouter>
					<Navbar />
					<div className="container">
						<Switch>
							<Route path="/" exact component={Home} />
							<AuthRoute path="/login" exact component={Login} />
							<AuthRoute path="/signup" exact component={Signup} />
							<Route path="/users/:handle" exact component={User} />
							<Route path="/users/:handle/scream/:screamId" exact component={User} />
						</Switch>
					</div>
				</BrowserRouter>
			</MuiThemeProvider>
		</Provider>
	);
};

export default App;
