'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, DATE, STRING } = Sequelize;
    await queryInterface.createTable('lesson_user_d', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      dKey: {
        type: STRING(64),
        null: false,
        default: '',
      },
      userId: {
        type: BIGINT,
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

    await queryInterface.addIndex('lesson_user_d', { fields: [ 'dKey' ] });
  },

  down: queryInterface => {
    return queryInterface.dropTable('lesson_user_d');
  },
};
