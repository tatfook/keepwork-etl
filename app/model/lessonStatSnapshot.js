'use strict';

module.exports = app => {
  const { BIGINT, STRING, DATE } = app.Sequelize;
  const Model = app.model.define('lesson_stat_snapshots', {
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
    totalPackages: {
      type: BIGINT,
      defaultValue: 0,
    },
    totalPassedPackages: {
      type: BIGINT,
      defaultValue: 0,
    },
    totalReviewingPackages: {
      type: BIGINT,
      defaultValue: 0,
    },
    newPackages: {
      type: BIGINT,
      defaultValue: 0,
    },
    newPassedPackages: {
      type: BIGINT,
      defaultValue: 0,
    },
    newReviewingPackages: {
      type: BIGINT,
      defaultValue: 0,
    },
    totalLessons: {
      type: BIGINT,
      defaultValue: 0,
    },
    newLessons: {
      type: BIGINT,
      defaultValue: 0,
    },
    totalLearners: {
      type: BIGINT,
      defaultValue: 0,
    },
    totalTestQuestions: {
      type: BIGINT,
      defaultValue: 0,
    },
    newLearners: {
      type: BIGINT,
      defaultValue: 0,
    },
    newTestQuestions: {
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
    app.model.LessonStatSnapshot.belongsTo(app.model.Time);
  };

  return Model;
};
