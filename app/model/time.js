'use strict';
const moment = require('moment');

module.exports = app => {
  const { INTEGER, SMALLINT, DATE, STRING } = app.Sequelize;
  const Model = app.model.define('times', {
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
    timestamps: false,
  });

  Model.today = async () => {
    return app.model.Time.getTimeByString(moment().format('YYYYMMDD'));
  };

  Model.todayId = () => {
    return moment().format('YYYYMMDD');
  };

  Model.getTimeByString = async timeString => {
    if (!timeString) throw new Error('Time cannot be null');
    const instance = await app.model.Time.findOne({ where: { id: moment(timeString).format('YYYYMMDD') } });
    if (!instance) throw new Error('Invalid Time: ' + timeString);
    return instance;
  };

  Model.prototype.isBeginOfWeek = function() {
    return this.dayOfWeek === 1;
  };

  Model.prototype.isBeginOfMonth = function() {
    return this.day === 1;
  };

  Model.prototype.lastDayId = function() {
    return moment(this.previousDay).format('YYYYMMDD');
  };

  Model.prototype.nextDayId = function() {
    return moment(this.nextDay).format('YYYYMMDD');
  };

  Model.prototype.weekEndDayId = function() {
    return moment(this.date).endOf('isoWeek').format('YYYYMMDD');
  };

  Model.prototype.weekStartDayId = function() {
    return moment(this.date).startOf('isoWeek').format('YYYYMMDD');
  };

  Model.prototype.monthEndDayId = function() {
    return moment(this.date).endOf('month').format('YYYYMMDD');
  };

  Model.prototype.monthStartDayId = function() {
    return moment(this.date).startOf('month').format('YYYYMMDD');
  };

  Model.prototype.lastWeekEndDayId = function() {
    return moment(this.date).subtract(1, 'weeks').endOf('isoWeek')
      .format('YYYYMMDD');
  };

  Model.prototype.lastWeekStartDayId = function() {
    return moment(this.date).subtract(1, 'weeks').startOf('isoWeek')
      .format('YYYYMMDD');
  };

  Model.prototype.lastMonthEndDayId = function() {
    return moment(this.date).subtract(1, 'months').endOf('month')
      .format('YYYYMMDD');
  };

  Model.prototype.lastMonthStartDayId = function() {
    return moment(this.date).subtract(1, 'months').startOf('month')
      .format('YYYYMMDD');
  };

  return Model;
};
