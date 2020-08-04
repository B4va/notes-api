import mongo from 'mongodb';

/**
 * Constructeur de la DAO propre aux notes.
 * @param {Object} database base de données
 * @returns {Object} méthodes DAO notes
 */
export default (database) => {
  // TODO : doc
  return Object.freeze({
    create,
    read,
    readAll,
    update,
    remove,
    removeAll,
  });

  async function create(note) {
    const db = await database;
    return await db.collection('notes').insertOne(note);
  }

  async function read(noteId) {
    const db = await database;
    const id = new mongo.ObjectID(noteId);
    return await db.collection('notes').findOne({ _id: id });
  }

  async function readAll() {
    const db = await database;
    return await db.collection('notes').find({}).toArray();
  }

  async function update(noteId, noteInfo) {
    const db = await database;
    const id = new mongo.ObjectID(noteId);
    return await db
      .collection('notes')
      .updateOne({ _id: id }, { $set: noteInfo });
  }

  async function remove(noteId) {
    const db = await database;
    const id = new mongo.ObjectID(noteId);
    return await db.collection('notes').deleteOne({ _id: id });
  }

  async function removeAll(noteId) {
    const db = await database;
    return await db.collection('notes').deleteMany({});
  }
};
