'use strict';

module.exports = app => {
  const { BIGINT, SMALLINT, INTEGER, DATE, STRING } = app.Sequelize;
  const User = app.model.define('user_d', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    dKey: {
      type: STRING(64),
    },
    email: {
      type: STRING(64),
    },
    mobile: {
      type: STRING(64),
    },
    username: {
      type: STRING(64),
    },
    nickname: {
      type: STRING(64),
    },
    authPhone: {
      type: STRING(64),
    },
    age: {
      type: INTEGER,
    },
    gender: {
      type: SMALLINT,
    },
    registerAt: {
      type: DATE,
    },
    createdAt: {
      type: DATE,
    },
    updatedAt: {
      type: DATE,
    },
  }, {
    underscored: false,
  });

  return User;
};
