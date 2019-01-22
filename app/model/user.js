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
    const params = _.pick(data, [ 'email', 'mobile', 'username', 'nickname', 'authPhone', 'age', 'gender', 'registerAt' ]);
    params.dKey = data.id;
    params.registerAt = _.now();
    return app.model.User.create(params);
  };

  Model.updateFromEvent = async data => {
    const params = _.pick(data, [ 'email', 'mobile', 'username', 'nickname', 'authPhone', 'age', 'gender' ]);
    const instance = await app.model.User.findOne({ where: { dKey: data.id }, order: [[ 'id', 'DESC' ]] });
    const res = await instance.update(params);
    return res; // instance.update(params);
  };

  Model.upsertFromEvent = async data => {
    if (!data.id) throw new Error('Id cannot be null');
    let instance;
    try {
      instance = await app.model.User.updateFromEvent(data);
    } catch (e) {
      instance = await app.model.User.createFromEvent(data);
    }
    return instance;
  };

  return Model;
};
