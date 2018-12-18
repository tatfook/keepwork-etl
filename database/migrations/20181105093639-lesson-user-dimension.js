'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, DATE, STRING } = Sequelize;
    await queryInterface.createTable('lesson_users', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      dKey: {
        type: STRING(64),
        allowNull: false,
      },
      userId: {
        type: BIGINT,
        allowNull: false,
      },
      role: {
        type: STRING(16),
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

    await queryInterface.addIndex('lesson_users', { fields: [ 'dKey' ] });
  },

  down: queryInterface => {
    return queryInterface.dropTable('lesson_users');
  },
};
