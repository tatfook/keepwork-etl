'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, STRING } = Sequelize;
    await queryInterface.createTable('package_snapshots', {
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
      subscribeCount: {
        type: BIGINT,
        defaultValue: 0,
      },
      totalIncome: {
        type: BIGINT,
        defaultValue: 0,
      },
      teachingCount: {
        type: BIGINT,
        defaultValue: 0,
      },
      learningCount: {
        type: BIGINT,
        defaultValue: 0,
      },
      newSubscribeCount: {
        type: BIGINT,
        defaultValue: 0,
      },
      newTotalIncome: {
        type: BIGINT,
        defaultValue: 0,
      },
      newTeachingCount: {
        type: BIGINT,
        defaultValue: 0,
      },
      newLearningCount: {
        type: BIGINT,
        defaultValue: 0,
      },
    }, {
      underscored: false,
    });

    await queryInterface.addIndex('package_snapshots', { fields: [ 'period', 'timeId', 'packageId' ], name: 'indexOfDimesion' });
    await queryInterface.addIndex('package_snapshots', { fields: [ 'subscribeCount', 'totalIncome', 'newSubscribeCount', 'newTotalIncome' ], name: 'indexOfSubscribe' });
    await queryInterface.addIndex('package_snapshots', { fields: [ 'teachingCount', 'learningCount', 'newTeachingCount', 'newLearningCount' ], name: 'indexOfLearning' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('package_snapshots');
  },
};
