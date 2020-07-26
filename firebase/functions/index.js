const functions = require('firebase-functions');

const app = require('express')();

const { db } = require('./util/admin');

const {
	getAllScreams,
	postOneScream,
	getScream,
	commentOnScream,
	likeScream,
	unlikeScream,
	deleteScream
} = require('./handlers/screams');

const {
	signup,
	login,
	uploadImage,
	addUserDetails,
	getAuthenticatedUser,
	getUserDetails,
	markNotificationsRead
} = require('./handlers/users');
const FBAuth = require('./util/fbAuth');

// get screams collection
app.get('/screams', getAllScreams);

// post scream
app.post('/scream', FBAuth, postOneScream);

// get scream
app.get('/scream/:screamId', getScream);

// delete scream
app.delete('/scream/:screamId', FBAuth, deleteScream);

// add like
app.get('/scream/:screamId/like', FBAuth, likeScream);

// remove like
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);

// add comment
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);

// update user data
app.post('/user', FBAuth, addUserDetails);

// get user data
app.get('/user', FBAuth, getAuthenticatedUser);

// signup route
app.post('/signup', signup);

// login route
app.post('/login', login);

// upload user image
app.post('/user/image', FBAuth, uploadImage);

// get publick user details
app.get('/user/:handle', getUserDetails);

// mark notifications as read
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.region('europe-west3').https.onRequest(app);

exports.createNotificationOnlike = functions
	.region('europe-west3')
	.firestore.document('likes/{id}')
	.onCreate((snapshot) => {
		return db
			.doc(`/screams/${snapshot.data().screamId}`)
			.get()
			.then((doc) => {
				if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
					return db.doc(`/notifications/${snapshot.id}`).set({
						recipient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						read: 'false',
						screamId: doc.id,
						type: 'like',
						createdAt: new Date().toISOString()
					});
				}
			})
			.catch((err) => console.error(err));
	});

exports.deleteNotificationOnUnLike = functions
	.region('europe-west3')
	.firestore.document('likes/{id}')
	.onDelete((snapshot) => {
		return db
			.doc(`/notifications/${snapshot.id}`)
			.delete()
			.catch((err) => {
				console.error(err);
				return;
			});
	});

exports.createNotificationOnComment = functions
	.region('europe-west3')
	.firestore.document('comments/{id}')
	.onCreate((snapshot) => {
		return db
			.doc(`/screams/${snapshot.data().screamId}`)
			.get()
			.then((doc) => {
				if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
					return db.doc(`/notifications/${snapshot.id}`).set({
						recipient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						read: 'false',
						screamId: doc.id,
						type: 'comment',
						createdAt: new Date().toISOString()
					});
				}
			})
			.catch((err) => console.error(err));
	});

exports.onUserImageChange = functions
	.region('europe-west3')
	.firestore.document('/users/{userId}')
	.onUpdate((change) => {
		if (change.before.data().imageUrl !== change.after.data().imageUrl) {
			let batch = db.batch();
			return db
				.collection('screams')
				.where('userHandle', '==', change.before.data().handle)
				.get()
				.then((data) => {
					data.forEach((doc) => {
						const scream = db.doc(`/screams/${doc.id}`);
						batch.update(scream, { userImage: change.after.data().imageUrl });
					});
					return batch.commit();
				});
		} else {
			return true;
		}
	});

exports.onScreamDelete = functions
	.region('europe-west3')
	.firestore.document('/screams/{screamId}')
	.onDelete((snapshot, context) => {
		const screamId = context.params.screamId;
		const batch = db.batch();

		return db
			.collection('comments')
			.where('screamId', '==', screamId)
			.get()
			.then((data) => {
				console.log('comments', data);

				data.forEach((doc) => {
					batch.delete(db.doc(`/comments/${doc.id}`));
				});
				return db.collection('likes').where('screamId', '==', screamId).get();
			})
			.then((data) => {
				console.log('likes', data);

				data.forEach((doc) => {
					batch.delete(db.doc(`/likes/${doc.id}`));
				});
				return db.collection('notifications').where('screamId', '==', screamId).get();
			})
			.then((data) => {
				console.log('notifications', data);

				data.forEach((doc) => {
					batch.delete(db.doc(`/notifications/${doc.id}`));
				});
				return batch.commit();
			})
			.catch((err) => console.error(err));
	});
