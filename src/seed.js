import buildDatabase from './app/core/db/index';
import buildUsersDao from './app/users/users_dao';
import buildAuthDao from './app/core/auth/auth_dao';
import buildNoteDao from './app/notes/notes_dao';

const db = buildDatabase();
const usersDao = buildUsersDao(db);
executeSeed('Users', usersDao, usersSeed);
const authDao = buildAuthDao(db);
executeSeed('Auth', authDao, authSeed);
const notesDao = buildNotesDao(db);
executeSeed('Notes', notesDao, notesSeed);

/**
 * Users.
 */
function usersSeed(dao) {
	// TODO
}

/**
 * Auth - Revoked token.
 */
function authSeed(dao) {
	// TODO
}

/**
 * Notes.
 */
function notesSeed(dao) {
	// TODO
}

function executeSeed(model, dao, seed) {
	try {
		seed(dao);
	} catch (e) {
		log(model, false, e);
	}
	log(model, true);
}

function log(model, done, error = undefined) {
	const message = done ? 'ok' : 'erreur';
	console.log('SEED - ' + model + ' - ' + message);
	if (error) {
		console.log(error);
	}
}
