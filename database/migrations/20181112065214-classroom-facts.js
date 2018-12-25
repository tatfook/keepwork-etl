'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, INTEGER, STRING, DATE } = Sequelize;
    await queryInterface.createTable('classroom_facts', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      beginTimeId: {
        type: BIGINT,
        allowNull: false,
      },
      endTimeId: {
        type: BIGINT,
        default: 1,
      },
      teacherId: {
        type: BIGINT,
        allowNull: false,
      },
      packageId: {
        type: BIGINT,
        allowNull: false,
      },
      lessonId: {
        type: BIGINT,
        allowNull: false,
      },
      classroomKey: {
        type: STRING(64),
      },
      studentCount: {
        type: INTEGER,
        default: 0,
      },
      timeAmount: {
        type: INTEGER,
      },
      beginAt: {
        type: DATE,
      },
      endAt: {
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

    await queryInterface.addIndex('classroom_facts', { fields: [ 'beginTimeId', 'endTimeId', 'teacherId', 'packageId', 'lessonId' ], name: 'indexOfDimesion' });

    await queryInterface.addIndex('classroom_facts', { fields: [ 'classroomKey', 'studentCount', 'timeAmount' ], name: 'indexOfTeaching' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('classroom_facts');
  },
};
