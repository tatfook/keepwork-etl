'use strict';

module.exports = app => {
  const { BIGINT, DATE, STRING } = app.Sequelize;
  const Model = app.model.define('lesson_user_d', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    dKey: {
      type: STRING(64),
      null: false,
      default: '',
    },
    userId: { // user dimension
      type: BIGINT,
    },
    role: {
      type: STRING(16),
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
    app.model.LessonUser.belongsTo(app.model.User);
  };

  return Model;
};
