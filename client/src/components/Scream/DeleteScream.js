import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';
import { deleteScream } from '../../redux/actions/dataActions';
// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
// Comopnents
import MyButton from '../../util/MyButton';

const styles = {
	deleteButton: {
		position: 'absolute',
		left: '90%',
		top: '10%'
	}
};

const DeleteScream = ({ deleteScream, screamId, classes }) => {
	const [isOpen, seIsOpen] = useState(false);

	const handleOpen = () => {
		seIsOpen(true);
	};

	const handleClose = () => {
		seIsOpen(false);
	};

	const handleDeleteScream = () => {
		deleteScream(screamId);
		seIsOpen(false);
	};

	return (
		<>
			<MyButton tip="Delete Scream" onClick={handleOpen} btnClassName={classes.deleteButton}>
				<DeleteOutlineIcon color="secondary" />
			</MyButton>
			<Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
				<DialogTitle>Are you sure you want to delete this scream ?</DialogTitle>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDeleteScream} color="secondary">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

DeleteScream.propTypes = {
	deleteScream: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
	screamId: PropTypes.string.isRequired
};

const mapActionsToProps = { deleteScream };

export default connect(null, mapActionsToProps)(withStyles(styles)(DeleteScream));
