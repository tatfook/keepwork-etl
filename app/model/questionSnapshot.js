'use strict';

module.exports = app => {
  const { BIGINT, STRING, DATE } = app.Sequelize;
  const Model = app.model.define('question_snapshots', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    period: {
      type: STRING(16),
    },
    timeId: {
      type: BIGINT,
      allowNull: false,
    },
    packageId: {
      type: BIGINT,
      allowNull: false,
    },
    lessonId: {
      type: BIGINT,
      allowNull: false,
    },
    questionId: {
      type: BIGINT,
      allowNull: false,
    },
    rightAmount: {
      type: BIGINT,
      defaultValue: 0,
    },
    wrongAmount: {
      type: BIGINT,
      defaultValue: 0,
    },
    newRightAmount: {
      type: BIGINT,
      defaultValue: 0,
    },
    newWrongAmount: {
      type: BIGINT,
      defaultValue: 0,
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
    app.model.QuestionSnapshot.belongsTo(app.model.Time);
    app.model.QuestionSnapshot.belongsTo(app.model.Package);
    app.model.QuestionSnapshot.belongsTo(app.model.Lesson);
    app.model.QuestionSnapshot.belongsTo(app.model.Question);
  };

  return Model;
};
