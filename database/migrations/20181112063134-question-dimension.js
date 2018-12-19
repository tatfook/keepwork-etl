'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, DATE, TEXT, INTEGER } = Sequelize;
    await queryInterface.createTable('questions', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      lessonId: { // lesson dimension
        type: BIGINT,
        allowNull: false,
      },
      index: {
        type: INTEGER,
        allowNull: false,
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

    await queryInterface.addIndex('questions', { fields: [ 'lessonId', 'index' ], name: 'indexOfLesson' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('questions');
  },
};
