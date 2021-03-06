'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, STRING, DATE } = Sequelize;
    await queryInterface.createTable('lesson_stat_snapshots', {
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
      totalQuestions: {
        type: BIGINT,
        defaultValue: 0,
      },
      newQuestions: {
        type: BIGINT,
        defaultValue: 0,
      },
      totalTestQuestions: {
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

    await queryInterface.addIndex('lesson_stat_snapshots', { fields: [ 'period', 'timeId' ], name: 'indexOfDimesion' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('lesson_stat_snapshots');
  },
};
