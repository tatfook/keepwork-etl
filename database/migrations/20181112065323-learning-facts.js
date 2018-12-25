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
        defaultValue: 1,
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
        allowNull: false,
      },
      quizSize: {
        type: INTEGER,
        defaultValue: 0,
      },
      quizRight: {
        type: INTEGER,
        defaultValue: 0,
      },
      quizWrong: {
        type: INTEGER,
        defaultValue: 0,
      },
      coinReward: {
        type: INTEGER,
        defaultValue: 0,
      },
      beanReward: {
        type: INTEGER,
        defaultValue: 0,
      },
      timeAmount: {
        type: INTEGER,
        defaultValue: 0,
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
