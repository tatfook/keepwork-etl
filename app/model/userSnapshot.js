'use strict';

module.exports = app => {
  const { BIGINT, STRING, INTEGER, DATE } = app.Sequelize;
  const Model = app.model.define('user_snapshots', {
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
    userId: {
      type: BIGINT,
      allowNull: false,
    },
    totalProjects: {
      type: BIGINT,
      defaultValue: 0,
    },
    totalParacraftProjects: {
      type: BIGINT,
      defaultValue: 0,
    },
    totalSiteProjects: {
      type: BIGINT,
      defaultValue: 0,
    },
    newProjects: {
      type: BIGINT,
      defaultValue: 0,
    },
    newParacraftProjects: {
      type: BIGINT,
      defaultValue: 0,
    },
    newSiteProjects: {
      type: BIGINT,
      defaultValue: 0,
    },
    totalCreateIssues: {
      type: BIGINT,
      defaultValue: 0,
    },
    totalAssignedIssues: {
      type: BIGINT,
      defaultValue: 0,
    },
    totalClosedIssues: {
      type: BIGINT,
      defaultValue: 0,
    },
    totalTestQuestions: {
      type: BIGINT,
      defaultValue: 0,
    },
    newAssignedIssues: {
      type: BIGINT,
      defaultValue: 0,
    },
    newClosedIssues: {
      type: BIGINT,
      defaultValue: 0,
    },
    newTestQuestions: {
      type: BIGINT,
      defaultValue: 0,
    },
    balance: {
      type: INTEGER,
      defaultValue: 0,
    },
    coins: {
      type: INTEGER,
      defaultValue: 0,
    },
    beans: {
      type: INTEGER,
      defaultValue: 0,
    },
    diffBalance: {
      type: INTEGER,
      defaultValue: 0,
    },
    diffCoins: {
      type: INTEGER,
      defaultValue: 0,
    },
    diffBeans: {
      type: INTEGER,
      defaultValue: 0,
    },
    totalSubscribes: {
      type: INTEGER,
      defaultValue: 0,
    },
    newSubscribes: {
      type: INTEGER,
      defaultValue: 0,
    },
    newLearnedLessons: {
      type: INTEGER,
      defaultValue: 0,
    },
    activity: {
      type: INTEGER,
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
    app.model.UserSnapshot.belongsTo(app.model.Time);
    app.model.UserSnapshot.belongsTo(app.model.User);
  };

  return Model;
};
