'use strict';

module.exports = app => {
  const { BIGINT, INTEGER, STRING } = app.Sequelize;
  const Model = app.model.define('learning_facts', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    beginTimeId: {
      type: BIGINT,
      null: false,
    },
    endTimeId: {
      type: BIGINT,
    },
    userId: {
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
    classroomKey: {
      type: STRING(64),
    },
    recordKey: {
      type: STRING(64),
    },
    quizSize: {
      type: INTEGER,
    },
    quizRight: {
      type: INTEGER,
    },
    quizWrong: {
      type: INTEGER,
    },
    coinReward: {
      type: INTEGER,
      default: 0,
    },
    beanReward: {
      type: INTEGER,
      default: 0,
    },
    timeAmount: {
      type: INTEGER,
    },
  }, {
    underscored: false,
  });

  Model.associate = () => {
    app.model.LearningFact.belongsTo(app.model.Time, {
      as: 'beginTime',
      foreignKey: 'beginTimeId',
    });
    app.model.LearningFact.belongsTo(app.model.Time, {
      as: 'endTime',
      foreignKey: 'endTimeId',
    });
    app.model.LearningFact.belongsTo(app.model.User);
    app.model.LearningFact.belongsTo(app.model.Package);
    app.model.LearningFact.belongsTo(app.model.Lesson);
  };

  return Model;
};
