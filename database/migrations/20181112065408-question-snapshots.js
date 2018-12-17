'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, STRING } = Sequelize;
    await queryInterface.createTable('question_snapshots', {
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
      questionId: {
        type: BIGINT,
        null: false,
      },
      rightAmount: {
        type: BIGINT,
        defaultValue: 0,
      },
      wrongAmount: {
        type: BIGINT,
        defaultValue: 0,
      },
      newRightAmount: {
        type: BIGINT,
        defaultValue: 0,
      },
      newWrongAmount: {
        type: BIGINT,
        defaultValue: 0,
      },
    }, {
      underscored: false,
    });

    await queryInterface.addIndex('question_snapshots', { fields: [ 'period', 'timeId', 'packageId', 'lessonId', 'questionId' ], name: 'indexOfDimesion' });
    await queryInterface.addIndex('question_snapshots', { fields: [ 'rightAmount', 'wrongAmount' ], name: 'indexOfLearning' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('question_snapshots');
  },
};
