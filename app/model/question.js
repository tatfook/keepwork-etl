'use strict';

module.exports = app => {
  const { BIGINT, DATE, TEXT, INTEGER } = app.Sequelize;
  const Model = app.model.define('questions', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
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
