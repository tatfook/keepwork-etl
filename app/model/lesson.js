'use strict';

module.exports = app => {
  const { BIGINT, DATE, STRING, INTEGER, TEXT } = app.Sequelize;
  const Model = app.model.define('lesson_d', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    dKey: {
      type: STRING(64),
    },
    userId: { // user dimension
      type: BIGINT,
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
    creatorId: {
      type: BIGINT,
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

  return Model;
};
