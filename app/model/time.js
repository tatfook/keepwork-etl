'use strict';

module.exports = app => {
  const { INTEGER, SMALLINT, DATE, STRING } = app.Sequelize;
  const Model = app.model.define('time_d', {
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

  return Model;
};
