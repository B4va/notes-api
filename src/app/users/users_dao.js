export default (database) => {
  return Object.freeze({
    create,
    read,
    update,
    remove,
  });

  async function create(user) {
    const db = await database;
    return await db.collection('users').insertOne(user);
  }

  async function read(userId) {
    const db = await database;
    return await db.collection('users').findById(userId);
  }

  async function update(userId, userInfo) {
    const db = await database;
    return await db.collection('users').updateOne(userId, userInfo);
  }

  async function remove(userId) {
    const db = await database;
    return await db.collection('users').deleteOne(userId);
  }
};
