'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, SMALLINT, INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('user_d', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      dKey: {
        type: STRING(64),
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

    await queryInterface.addIndex('user_d', { fields: [ 'dKey' ] });
    await queryInterface.addIndex('user_d', { fields: [ 'email', 'mobile', 'authPhone' ], name: 'indexOfContactInfo' });
    await queryInterface.addIndex('user_d', { fields: [ 'registerAt', 'age', 'gender' ], name: 'indexOfUserInfo' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('user_d');
  },
};
