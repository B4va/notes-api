import mongo from 'mongodb';

export default (database) => {
  return Object.freeze({
    checkToken,
    addToken,
  });

  async function checkToken(token) {
    const db = await database;
    const tokenFound = await db.collection('token').findOne({ token: token });
    if (tokenFound) {
      throw new Error();
    }
  }

  async function addToken(token) {
    const db = await database;
    const id = new mongo.ObjectID(userId);
    await db.collection('token').insertOne({ token: token });
  }
};
