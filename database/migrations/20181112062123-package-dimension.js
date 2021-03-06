'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, SMALLINT, INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('packages', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      dKey: {
        type: STRING(64),
        allowNull: false,
      },
      name: {
        type: STRING(64),
      },
      userId: {
        type: BIGINT,
        allowNull: false,
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
      lessonCount: {
        type: INTEGER,
      },
      state: {
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

    await queryInterface.addIndex('packages', { fields: [ 'dKey' ] });
    await queryInterface.addIndex('packages', { fields: [ 'minAge', 'maxAge', 'lessonCount' ], name: 'indexOfPackageInfo' });
    await queryInterface.addIndex('packages', { fields: [ 'createdAt', 'updatedAt' ], name: 'indexOfTime' });
    await queryInterface.addIndex('packages', { fields: [ 'subjectId', 'subjectName' ], name: 'indexOfSubject' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('packages');
  },
};
