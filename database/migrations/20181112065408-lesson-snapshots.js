'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, STRING, DATE } = Sequelize;
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
      createdAt: {
        type: DATE,
      },
      updatedAt: {
        type: DATE,
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
