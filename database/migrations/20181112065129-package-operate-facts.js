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
      action: {
        type: STRING(16),
        null: false,
      },
      remark: {
        type: STRING(1024),
      },
      operateAt: {
        type: DATE,
        null: false,
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
