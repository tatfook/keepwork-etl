'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, STRING, DATE } = Sequelize;
    await queryInterface.createTable('package_operate_facts', {
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
      action: {
        type: STRING(16),
        allowNull: false,
      },
      remark: {
        type: STRING(1024),
      },
      operateAt: {
        type: DATE,
        allowNull: false,
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

    await queryInterface.addIndex('package_operate_facts', { fields: [ 'timeId', 'userId', 'packageId' ], name: 'indexOfDimesion' });
    await queryInterface.addIndex('package_operate_facts', { fields: [ 'action' ], name: 'indexOfAction' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('package_operate_facts');
  },
};
