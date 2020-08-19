import buildDatabase from './src/app/core/db/index';
import mongo from 'mongodb';

seed();

async function seed() {
	const db = await buildDatabase();
	console.log('-- Connecté à la base de données --\n');
	await execute('delete all', db, deleteAll);
	await execute('users', db, usersSeed);
	await execute('token', db, tokenSeed);
	await execute('notes', db, notesSeed);
	console.log('\n-- SEED :: OK --\n');
	process.exit(0);
}

/**
 * Deleting all. 
 */
async function deleteAll(db) {
	await db.collection('users').deleteMany({});
	await db.collection('notes').deleteMany({});
	await db.collection('token').deleteMany({})
}

/**
 * Users.
 */
async function usersSeed(db, model) {
	await db.collection(model).insertOne({
		email: 'email1@mail.foo',
		password: 'password1234',
		trace: '0123456789',
	});
	await db.collection(model).insertOne({
		email: 'email2@mail.foo',
		password: 'pass_word',
		trace: '2468101214',
	});
	await db.collection(model).insertOne({
		email: 'email3@mail.foo',
		password: 'p@ssword',
		trace: '9876543210',
	});
}

/**
 * Token. 
 */
async function tokenSeed(db, model) {
	await db.collection(model).insertOne({
		token: 'revokedtoken',
	});
}

/**
 * Notes.
 */
async function notesSeed(db, model = undefined) {
	const user1 = db.collection('users').findOne({ email: 'email1@mail.foo' });
	const user2 = db.collection('users').findOne({ email: 'email2@mail.foo' });
	await db.collection(model).insertOne({
		title: 'first note',
		content: 'Nostrud sunt eu exercitation commodo aliqua cupidatat cupidatat tempor do qui enim anim.',
		color: 'gray',
		userId: user1._id, // associé à User1
	});
	await db.collection(model).insertOne({
		title: 'second note',
		content: 'Nisi esse tempor duis duis laboris quis labore est eu ea ea ipsum dolor.',
		color: 'blue',
		userId: user1._id, // associé à User1
	});
	await db.collection(model).insertOne({
		title: 'third note',
		content: 'Culpa minim nisi reprehenderit minim.',
		color: 'yellow',
		userId: user2._id, // associé à User2
	});
}

/****/

async function execute(model, db, seed) {
	try {
		await seed(db, model);
	} catch (e) {
		log(model, false, e);
	}
	log(model, true);
}

function log(model, done, error = undefined) {
	const message = done ? 'ok' : 'erreur';
	console.log('SEED :: ' + model + ' - ' + message);
	if (error) {
		console.log('\n' + error);
	}
}
