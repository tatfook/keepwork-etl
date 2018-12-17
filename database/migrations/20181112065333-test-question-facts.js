'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, STRING, BOOLEAN } = Sequelize;
    await queryInterface.createTable('test_question_facts', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      timeId: {
        type: BIGINT,
        null: false,
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
      questionId: {
        type: BIGINT,
        null: false,
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
