'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, STRING, BOOLEAN, DATE } = Sequelize;
    await queryInterface.createTable('test_question_facts', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      timeId: {
        type: BIGINT,
        allowNull: false,
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
      questionId: {
        type: BIGINT,
        allowNull: false,
      },
      classroomKey: {
        type: STRING(64),
      },
      recordKey: {
        type: STRING(64),
      },
      answer: {
        type: STRING(64),
      },
      isRight: {
        type: BOOLEAN,
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

    await queryInterface.addIndex('test_question_facts', { fields: [ 'timeId', 'userId', 'packageId', 'lessonId', 'questionId' ], name: 'indexOfDimesion' });
    await queryInterface.addIndex('test_question_facts', { fields: [ 'classroomKey', 'recordKey' ], name: 'indexOfLearning' });
    await queryInterface.addIndex('test_question_facts', { fields: [ 'isRight', 'answer' ], name: 'indexOfAnswer' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('test_question_facts');
  },
};
