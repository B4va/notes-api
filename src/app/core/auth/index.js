// ! à tester

import jwt from 'jsonwebtoken';
import 'dotenv/config';
import buildTokenDao from './token_dao';

export default buildAuthManager;

async function buildAuthManager(database) {
  const tokenDao = buildTokenDao(database);
  return Object.freeze({
    generateToken,
    verifyToken,
    revokeToken,
    authenticateUser,
  });

  async function generateToken(id) {
    const token = await jwt.sign({id}, process.env.TOKEN_SECRET);
    return { status: 'Token généré.', token: token };
  }

  async function verifyToken(token) {
    await tokenDao.checkToken(token);
    return await jwt.verify(token, process.env.TOKEN_SECRET);
  }

  async function revokeToken(token) {
    await tokenDao.addToken(token);
    return { status: 'Token révoqué.' };
  }

  async function authenticateUser(email, password) {
    const db = await database;
    const user = await db
      .collection('users')
      .findOne({ email: email, password: password });
    if (user) {
      return user._id;
    } else {
      throw new Error();
    }
  }
}
