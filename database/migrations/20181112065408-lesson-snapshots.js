'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, STRING } = Sequelize;
    await queryInterface.createTable('lesson_snapshots', {
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
      teachingCount: {
        type: BIGINT,
        defaultValue: 0,
      },
      learningCount: {
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

    await queryInterface.addIndex('lesson_snapshots', { fields: [ 'period', 'timeId', 'packageId', 'lessonId' ], name: 'indexOfDimesion' });
    await queryInterface.addIndex('lesson_snapshots', { fields: [ 'teachingCount', 'learningCount', 'newTeachingCount', 'newLearningCount' ], name: 'indexOfLearning' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('lesson_snapshots');
  },
};
