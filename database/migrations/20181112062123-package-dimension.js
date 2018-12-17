'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, SMALLINT, INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('package_d', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      dKey: {
        type: STRING(64),
      },
      name: {
        type: STRING(64),
      },
      userId: {
        type: BIGINT,
      },
      subjectId: {
        type: BIGINT,
      },
      subjectName: {
        type: STRING(64),
      },
      minAge: {
        type: SMALLINT,
      },
      maxAge: {
        type: SMALLINT,
      },
      price: {
        type: INTEGER,
      },
      lessonCount: {
        type: INTEGER,
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

    await queryInterface.addIndex('package_d', { fields: [ 'dKey' ] });
    await queryInterface.addIndex('package_d', { fields: [ 'price', 'minAge', 'maxAge', 'lessonCount' ], name: 'indexOfPackageInfo' });
    await queryInterface.addIndex('package_d', { fields: [ 'createdAt', 'updatedAt' ], name: 'indexOfTime' });
    await queryInterface.addIndex('package_d', { fields: [ 'subjectId', 'subjectName' ], name: 'indexOfSubject' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('package_d');
  },
};
