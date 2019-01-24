'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const moment = require('moment');

describe('test/app/model/time.test.js', () => {
  let ctx;
  let error;
  beforeEach(() => {
    error = undefined;
    ctx = app.mockContext();
  });

  describe('#today', () => {
    it('should return today', async () => {
      const today = await ctx.model.Time.today();
      assert(today.id.toString() === moment().format('YYYYMMDD'));
    });
  });

  describe('#todayId', () => {
    it('should return today', async () => {
      const todayId = await ctx.model.Time.todayId();
      assert(todayId === moment().format('YYYYMMDD'));
    });
  });

  describe('#getTimeByString', () => {
    it('should return time instance with format yyyy-mm-dd', async () => {
      const today = await ctx.model.Time.getTimeByString('2018-11-12');
      assert(today.id === 20181112);
    });

    it('should return time instance with format yyyy-mm-dd hh:mm:ss', async () => {
      const today = await ctx.model.Time.getTimeByString('2018-11-12 12:00:00');
      assert(today.id === 20181112);
    });

    it('should return time instance with format yyyy/mm/dd', async () => {
      const today = await ctx.model.Time.getTimeByString('2018/11/12');
      assert(today.id === 20181112);
    });

    it('should return time instance with moment format', async () => {
      const today = await ctx.model.Time.getTimeByString(moment('2018-11-12'));
      assert(today.id === 20181112);
    });

    it('should raise error if time does not support', async () => {
      try {
        await ctx.model.Time.getTimeByString('2000-11-12');
      } catch (e) {
        error = e;
      }
      assert.ok(error);
    });

    it('should raise error if time is NULL', async () => {
      try {
        await ctx.model.Time.getTimeByString();
      } catch (e) {
        error = e;
      }
      assert.ok(error);
    });
  });

  describe('#isBeginOfWeek', () => {
    it('should return last day id', async () => {
      let day = await ctx.model.Time.getTimeByString('2019-01-06');
      assert(day.isBeginOfWeek() === false);
      day = await ctx.model.Time.getTimeByString('2019-01-07');
      assert(day.isBeginOfWeek() === true);
    });
  });

  describe('#isBeginOfMonth', () => {
    it('should return last day id', async () => {
      let day = await ctx.model.Time.getTimeByString('2019-01-02');
      assert(day.isBeginOfMonth() === false);
      day = await ctx.model.Time.getTimeByString('2019-01-01');
      assert(day.isBeginOfMonth() === true);
    });
  });

  describe('#lastDayId', () => {
    it('should return last day id', async () => {
      let day = await ctx.model.Time.getTimeByString('2019-01-01');
      assert(day.lastDayId() === '20181231');
      day = await ctx.model.Time.getTimeByString('2019-03-01');
      assert(day.lastDayId() === '20190228');
      day = await ctx.model.Time.getTimeByString('2019-04-01');
      assert(day.lastDayId() === '20190331');
      day = await ctx.model.Time.getTimeByString('2019-05-01');
      assert(day.lastDayId() === '20190430');
    });
  });

  describe('#lastWeekEndDayId', () => {
    it('should return last week id', async () => {
      let day = await ctx.model.Time.getTimeByString('2019-01-06');
      assert(day.lastWeekEndDayId() === '20181230');
      day = await ctx.model.Time.getTimeByString('2019-01-13');
      assert(day.lastWeekEndDayId() === '20190106');
    });
  });

  describe('#lastMonthEndDayId', () => {
    it('should return last month id', async () => {
      let day = await ctx.model.Time.getTimeByString('2019-01-31');
      assert(day.lastMonthEndDayId() === '20181231');
      day = await ctx.model.Time.getTimeByString('2019-02-28');
      assert(day.lastMonthEndDayId() === '20190131');
      day = await ctx.model.Time.getTimeByString('2019-03-31');
      assert(day.lastMonthEndDayId() === '20190228');
    });
  });
});
