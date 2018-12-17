'use strict';

module.exports = app => {
  const { BIGINT, DATE, TEXT, INTEGER, STRING } = app.Sequelize;
  const Model = app.model.define('question_d', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    dKey: {
      type: STRING(64),
    },
    lessonId: { // lesson dimension
      type: BIGINT,
    },
    index: {
      type: INTEGER,
    },
    content: {
      type: TEXT,
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
    app.model.Question.belongsTo(app.model.Lesson);
  };

  return Model;
};
