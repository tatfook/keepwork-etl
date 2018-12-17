'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, DATE, STRING, INTEGER, TEXT } = Sequelize;
    await queryInterface.createTable('lesson_d', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      dKey: {
        type: STRING(64),
      },
      userId: { // user dimension
        type: BIGINT,
      },
      name: {
        type: STRING(64),
      },
      url: {
        type: STRING(1024),
      },
      goal: {
        type: STRING(1024),
      },
      content: {
        type: TEXT,
      },
      quizSize: {
        type: INTEGER,
        default: 0,
      },
      creatorId: {
        type: BIGINT,
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

    await queryInterface.addIndex('lesson_d', { fields: [ 'dKey' ] });
    await queryInterface.addIndex('lesson_d', { fields: [ 'quizSize' ] });

  },

  down: queryInterface => {
    return queryInterface.dropTable('lesson_d');
  },
};
