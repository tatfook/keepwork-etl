'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, SMALLINT, INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('users', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      dKey: {
        type: STRING(64),
        allowNull: false,
      },
      email: {
        type: STRING(64),
      },
      mobile: {
        type: STRING(64),
      },
      username: {
        type: STRING(64),
      },
      nickname: {
        type: STRING(64),
      },
      authPhone: {
        type: STRING(64),
      },
      age: {
        type: INTEGER,
      },
      gender: {
        type: SMALLINT,
      },
      registerAt: {
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

    await queryInterface.addIndex('users', { fields: [ 'dKey' ] });
    await queryInterface.addIndex('users', { fields: [ 'email', 'mobile', 'authPhone' ], name: 'indexOfContactInfo' });
    await queryInterface.addIndex('users', { fields: [ 'registerAt', 'age', 'gender' ], name: 'indexOfUserInfo' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('users');
  },
};
