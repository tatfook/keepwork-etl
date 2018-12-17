'use strict';

module.exports = app => {
  const { BIGINT, STRING } = app.Sequelize;
  const Model = app.model.define('user_stat_snapshots', {
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
    totalUsers: {
      type: BIGINT,
      defaultValue: 0,
    },
    newRegisterUsers: {
      type: BIGINT,
      defaultValue: 0,
    },
    totalLessonUsers: {
      type: BIGINT,
      defaultValue: 0,
    },
    newLessonUsers: {
      type: BIGINT,
      defaultValue: 0,
    },
    activeUsers: {
      type: BIGINT,
      defaultValue: 0,
    },
    learningUsers: {
      type: BIGINT,
      defaultValue: 0,
    },
    newLearningUsers: {
      type: BIGINT,
      defaultValue: 0,
    },
    pblUsers: {
      type: BIGINT,
      defaultValue: 0,
    },
    newPblUsers: {
      type: BIGINT,
      defaultValue: 0,
    },
  }, {
    underscored: false,
  });

  Model.associate = () => {
    app.model.UserStatSnapshot.belongsTo(app.model.Time);
  };

  return Model;
};
