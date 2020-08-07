import mongo from 'mongodb';

/**
 * Constructeur de la DAO propre aux notes.
 * @param {Object} database base de données
 * @returns {Object} méthodes DAO notes
 */
export default (database) => {
  return Object.freeze({
    create,
    read,
    readAll,
    update,
    remove,
    removeAll,
  });

  /**
   * Crée une note.
   * @param {Object} note informations note
   * @returns {Object} note
   */
  async function create(note) {
    const db = await database;
    return await db.collection('notes').insertOne(note);
  }

  /**
   * Accède à une note.
   * @param {String} noteId id note
   * @returns {Object} note
   */
  async function read(noteId) {
    const db = await database;
    const id = new mongo.ObjectID(noteId);
    return await db.collection('notes').findOne({ _id: id });
  }

  /**
   * Accède à toutes les notes.
   * @returns {Array} liste de note
   */
  async function readAll(userId) {
    const db = await database;
    return await db.collection('notes').findOne({ userId: userId }).toArray();
  }

  /**
   * Met à jour une note.
   * @param {String} noteId id note
   * @param {Object} noteInfo informations note
   * @returns {Object} note
   */
  async function update(noteId, noteInfo) {
    const db = await database;
    const id = new mongo.ObjectID(noteId);
    return await db
      .collection('notes')
      .updateOne({ _id: id }, { $set: noteInfo });
  }

  /**
   * Supprime une note.
   * @param {String} noteId id note
   * @returns {Object} note
   */
  async function remove(noteId) {
    const db = await database;
    const id = new mongo.ObjectID(noteId);
    return await db.collection('notes').deleteOne({ _id: id });
  }

  /**
   * Supprime toutes les notes.
   * @param {String} noteId id notes
   * @returns {Object} note
   */
  async function removeAll(noteId) {
    const db = await database;
    return await db.collection('notes').deleteMany({});
  }
};
