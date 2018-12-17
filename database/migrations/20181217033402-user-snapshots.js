'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, STRING, INTEGER } = Sequelize;
    await queryInterface.createTable('user_snapshots', {
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
      userId: {
        type: BIGINT,
        null: false,
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
    }, {
      underscored: false,
    });

    await queryInterface.addIndex('user_snapshots', { fields: [ 'period', 'timeId' ], name: 'indexOfDimesion' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('user_snapshots');
  },
};
