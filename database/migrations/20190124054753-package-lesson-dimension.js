'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, DATE } = Sequelize;
    await queryInterface.createTable('package_lessons', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      packageId: {
        type: BIGINT,
        allowNull: false,
      },
      lessonId: {
        type: BIGINT,
        allowNull: false,
      },
      deletedAt: {
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

    return await queryInterface.addIndex('package_lessons', { fields: [ 'packageId', 'lessonId', 'deletedAt' ], unique: true });
  },

  down: queryInterface => {
    return queryInterface.dropTable('package_lessons');
  },
};
