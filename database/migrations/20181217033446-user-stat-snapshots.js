'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, STRING } = Sequelize;
    await queryInterface.createTable('user_stat_snapshots', {
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

    await queryInterface.addIndex('user_stat_snapshots', { fields: [ 'period', 'timeId' ], name: 'indexOfDimesion' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('user_stat_snapshots');
  },
};
