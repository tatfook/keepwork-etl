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
        console.log(e);
        error = e;
      }
      assert(error);
    });

    it('should raise error if time is NULL', async () => {
      try {
        await ctx.model.Time.getTimeByString();
      } catch (e) {
        console.log(e);
        error = e;
      }
      assert(error);
    });
  });
});
