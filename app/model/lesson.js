'use strict';
const _ = require('lodash');

module.exports = app => {
  const { BIGINT, DATE, STRING, INTEGER, TEXT } = app.Sequelize;
  const Model = app.model.define('lessons', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    dKey: {
      type: STRING(64),
      allowNull: false,
    },
    userId: { // user dimension
      type: BIGINT,
      allowNull: false,
    },
    name: {
      type: STRING(64),
    },
    url: {
      type: STRING(1024),
    },
    goal: {
      type: STRING(1024),
    },
    content: {
      type: TEXT,
    },
    quizSize: {
      type: INTEGER,
      default: 0,
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

  Model.associate = () => {
    app.model.Lesson.belongsTo(app.model.User);
  };

  Model.createFromEvent = async data => {
    const params = _.pick(data, [ 'userId', 'name', 'url', 'goal', 'content', 'quizSize' ]);
    params.dKey = data.id;
    const user = await app.model.User.findOne({ where: { dKey: params.userId }, order: [[ 'id', 'DESC' ]] });
    params.userId = user.id;
    return app.model.Lesson.create(params);
  };

  Model.updateFromEvent = async data => {
    const params = _.pick(data, [ 'name', 'url', 'goal', 'content', 'quizSize' ]);
    const instance = await app.model.Lesson.findOne({ where: { dKey: data.id }, order: [[ 'id', 'DESC' ]] });
    return instance.update(params);
  };

  Model.upsertFromEvent = async data => {
    if (!data.id) throw new Error('Id cannot be null');
    let instance;
    try {
      instance = await app.model.Lesson.updateFromEvent(data);
    } catch (e) {
      instance = await app.model.Lesson.createFromEvent(data);
    }
    return instance;
  };

  return Model;
};
