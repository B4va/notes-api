import mongo from 'mongodb';
import UniqueViolationError from '../core/helpers/unique_violation_error';

export default (database) => {
  // TODO : Revoir la gestion de l'unicité
  // ! email unique

  return Object.freeze({
    create,
    read,
    update,
    remove,
  });

  async function create(user) {
    const db = await database;
    if (!isEmailUnique(user.email, db))
      throw new UniqueViolationError("L'adresse mail est déjà utilisée.");
    return await db.collection('users').insertOne(user);
  }

  async function read(userId) {
    const db = await database;
    const id = new mongo.ObjectID(userId);
    return await db.collection('users').findOne({ _id: id });
  }

  async function update(userId, userInfo) {
    const db = await database;
    if (!isEmailUnique(userInfo.email, db))
      throw new UniqueViolationError("L'adresse mail est déjà utilisée.");
    const id = new mongo.ObjectID(userId);
    return await db
      .collection('users')
      .updateOne({ _id: id }, { $set: userInfo });
  }

  async function remove(userId) {
    const db = await database;
    const id = new mongo.ObjectID(userId);
    return await db.collection('users').deleteOne({ _id: id });
  }

  async function isEmailUnique(email, db) {
    const check = await db.collection('users').findOne({ email: email });
    return !check;
  }
};
