'use strict';
const _ = require('lodash');

module.exports = app => {
  const { BIGINT, SMALLINT, INTEGER, DATE, STRING } = app.Sequelize;
  const Model = app.model.define('users', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    dKey: {
      type: STRING(64),
      allowNull: false,
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

  Model.createFromEvent = async data => {
    const params = _.pick(data, [ 'id', 'email', 'mobile', 'nickname', 'authPhone', 'age', 'gender' ]);
    params.dKey = params.id;
    params.registerAt = _.now();
    _.omit(params, [ 'id' ]);
    return app.model.User.create(params);
  };

  return Model;
};
