import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
	...theme.spreadIt,
	commentImage: {
		maxWidth: '100%',
		height: 100,
		objectFit: 'cover',
		borderRadius: '50%'
	},
	commentData: {
		marginLeft: 20
	}
});

const Comments = ({ comments, classes }) => {
	return (
		<>
			<Grid container style={{ padding: '0 40px' }}>
				{comments.map(({ body, createdAt, userImage, userHandle }, index) => (
					<Fragment key={createdAt}>
						<Grid item sm={12}>
							<Grid container>
								<Grid item sm={2}>
									<img src={userImage} alt="comment" className={classes.commentImage} />
								</Grid>
								<Grid item sm={9}>
									<div className={classes.commentData}>
										<Typography
											variant="h5"
											component={Link}
											to={`/users/${userHandle}`}
											color="primary"
										>
											{userHandle}
										</Typography>
										<Typography variant="body2" color="textSecondary">
											{dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
										</Typography>
										<hr className={classes.invisibleSeparator} />
										<Typography variabnt="body1">{body}</Typography>
									</div>
								</Grid>
							</Grid>
						</Grid>
						{index !== comments.length ? <hr className={classes.visibleSeparator} /> : ''}
					</Fragment>
				))}
			</Grid>
		</>
	);
};

Comments.propTypes = {
	classes: PropTypes.object.isRequired,
	comments: PropTypes.array.isRequired
};

export default withStyles(styles)(Comments);
