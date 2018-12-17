'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { BIGINT, INTEGER, STRING } = Sequelize;
    await queryInterface.createTable('class_teaching_facts', {
      id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      beginTimeId: {
        type: BIGINT,
        null: false,
      },
      endTimeId: {
        type: BIGINT,
      },
      teacherId: {
        type: BIGINT,
        null: false,
      },
      packageId: {
        type: BIGINT,
        null: false,
      },
      lessonId: {
        type: BIGINT,
        null: false,
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
    }, {
      underscored: false,
    });

    await queryInterface.addIndex('class_teaching_facts', { fields: [ 'beginTimeId', 'endTimeId', 'teacherId', 'packageId', 'lessonId' ], name: 'indexOfDimesion' });

    await queryInterface.addIndex('class_teaching_facts', { fields: [ 'classroomKey', 'studentCount', 'timeAmount' ], name: 'indexOfTeaching' });

  },

  down: queryInterface => {
    return queryInterface.dropTable('class_teaching_facts');
  },
};
