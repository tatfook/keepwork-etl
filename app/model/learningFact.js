'use strict';

module.exports = app => {
  const { BIGINT, INTEGER, STRING, DATE } = app.Sequelize;
  const Model = app.model.define('learning_facts', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    beginTimeId: {
      type: BIGINT,
      allowNull: false,
    },
    endTimeId: {
      type: BIGINT,
      default: 1,
    },
    userId: {
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
    beginAt: {
      type: DATE,
    },
    endAt: {
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
