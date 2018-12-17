'use strict';

module.exports = app => {
  const { BIGINT, STRING } = app.Sequelize;
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
      null: false,
    },
    packageId: {
      type: BIGINT,
      null: false,
    },
    lessonId: {
      type: BIGINT,
      null: false,
    },
    questionId: {
      type: BIGINT,
      null: false,
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
