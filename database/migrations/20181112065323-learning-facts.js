'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, INTEGER, STRING } = Sequelize;
    await queryInterface.createTable('learning_facts', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      beginTimeId: {
        type: BIGINT,
        null: false,
      },
      endTimeId: {
        type: BIGINT,
      },
      userId: {
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
      classroomKey: {
        type: STRING(64),
      },
      recordKey: {
        type: STRING(64),
      },
      quizSize: {
        type: INTEGER,
      },
      quizRight: {
        type: INTEGER,
      },
      quizWrong: {
        type: INTEGER,
      },
      coinReward: {
        type: INTEGER,
        default: 0,
      },
      beanReward: {
        type: INTEGER,
        default: 0,
      },
      timeAmount: {
        type: INTEGER,
      },
    }, {
      underscored: false,
    });

    await queryInterface.addIndex('learning_facts', { fields: [ 'beginTimeId', 'endTimeId', 'userId', 'packageId', 'lessonId' ], name: 'indexOfDimesion' });
    await queryInterface.addIndex('learning_facts', { fields: [ 'classroomKey', 'recordKey', 'timeAmount' ], name: 'indexOfLearning' });
    await queryInterface.addIndex('learning_facts', { fields: [ 'quizSize', 'quizRight', 'quizWrong' ], name: 'indexOfQuiz' });
    await queryInterface.addIndex('learning_facts', { fields: [ 'beanReward', 'coinReward' ], name: 'indexOfReward' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('learning_facts');
  },
};
