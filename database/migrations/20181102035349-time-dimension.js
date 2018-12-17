'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, SMALLINT, DATE, STRING } = Sequelize;
    await queryInterface.createTable('time_d', {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DATE,
      },
      year: {
        type: SMALLINT,
      },
      month: {
        type: SMALLINT,
      },
      day: {
        type: SMALLINT,
      },
      week: {
        type: SMALLINT,
      },
      quarter: {
        type: SMALLINT,
      },
      dayOfWeek: {
        type: SMALLINT,
      },
      dayOfYear: {
        type: SMALLINT,
      },
      monthName: {
        type: STRING(10),
      },
      dayName: {
        type: STRING(10),
      },
      previousDay: {
        type: DATE,
      },
      nextDay: {
        type: DATE,
      },
    }, {
      underscored: false,
    });

    await queryInterface.addIndex('time_d', { fields: [ 'date' ] });
    await queryInterface.addIndex('time_d', { fields: [ 'year', 'month', 'day' ] });
    await queryInterface.addIndex('time_d', { fields: [ 'year', 'quarter' ] });
    await queryInterface.addIndex('time_d', { fields: [ 'year', 'dayOfWeek' ] });
  },

  down: queryInterface => {
    return queryInterface.dropTable('time_d');
  },
};
