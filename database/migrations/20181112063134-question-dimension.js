'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, DATE, TEXT, INTEGER, STRING } = Sequelize;
    await queryInterface.createTable('question_d', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      dKey: {
        type: STRING(64),
      },
      lessonId: { // lesson dimension
        type: BIGINT,
      },
      index: {
        type: INTEGER,
      },
      content: {
        type: TEXT,
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

    await queryInterface.addIndex('question_d', { fields: [ 'dKey' ] });
    await queryInterface.addIndex('question_d', { fields: [ 'lessonId', 'index' ], name: 'indexOfLesson' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('question_d');
  },
};
