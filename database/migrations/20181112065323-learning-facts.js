'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, INTEGER, STRING, DATE } = Sequelize;
    await queryInterface.createTable('learning_facts', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      beginTimeId: {
        type: BIGINT,
        allowNull: false,
      },
      endTimeId: {
        type: BIGINT,
        default: 1,
      },
      userId: {
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
      beginAt: {
        type: DATE,
      },
      endAt: {
        type: DATE,
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

    await queryInterface.addIndex('learning_facts', { fields: [ 'beginTimeId', 'endTimeId', 'userId', 'packageId', 'lessonId' ], name: 'indexOfDimesion' });
    await queryInterface.addIndex('learning_facts', { fields: [ 'classroomKey', 'recordKey', 'timeAmount' ], name: 'indexOfLearning' });
    await queryInterface.addIndex('learning_facts', { fields: [ 'quizSize', 'quizRight', 'quizWrong' ], name: 'indexOfQuiz' });
    await queryInterface.addIndex('learning_facts', { fields: [ 'beanReward', 'coinReward' ], name: 'indexOfReward' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('learning_facts');
  },
};
