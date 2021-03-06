'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, DATE, STRING, INTEGER, TEXT } = Sequelize;
    await queryInterface.createTable('lessons', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      dKey: {
        type: STRING(64),
        allowNull: false,
      },
      userId: { // user dimension
        type: BIGINT,
        allowNull: false,
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

    await queryInterface.addIndex('lessons', { fields: [ 'dKey' ] });
    await queryInterface.addIndex('lessons', { fields: [ 'userId' ] });
    await queryInterface.addIndex('lessons', { fields: [ 'quizSize' ] });

  },

  down: queryInterface => {
    return queryInterface.dropTable('lessons');
  },
};
