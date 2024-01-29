const bcrypt = require("bcrypt");
const { db } = require("../db/db");

async function findUserByEmail(email) {
  return await db.user.findUnique({
    where: {
      email,
    },
  });
}

async function createUserByEmailAndPassword(user) {
  user.password = bcrypt.hashSync(user.password, 12);
  const createdUser = await db.user.create({
    data: user,
  });
  return createdUser;
}

async function findUserById(id) {
  return await db.user.findUnique({
    where: {
      id,
    },
  });
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUserByEmailAndPassword,
};
