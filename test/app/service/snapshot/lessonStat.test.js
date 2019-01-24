'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const moment = require('moment');

describe('test/app/service/snapshot/lessonStat.test.js', () => {
  let ctx;
  //   let error;
  beforeEach(async () => {
    // error = undefined;
    ctx = app.mockContext();
    await ctx.model.User.createFromEvent({ id: 123 });
  });

  describe('daily snapshot', () => {
    const day = '2019-01-09';
    const nextDay = '2019-01-10';
    beforeEach(async () => {
      await ctx.model.Package.createFromEvent({
        id: 12345,
        userId: 123,
        createdAt: day,
      });
      await ctx.model.Package.createFromEvent({
        id: 12346,
        userId: 123,
        createdAt: nextDay,
      });
    });

    it('should create a new daily snapshot', async () => {
      const time = await ctx.model.Time.getTimeByString(day);
      const snapshot = await ctx.service.snapshot.lessonStat.buildDailySnapshot(time);

      assert(snapshot.period === 'daily');
      assert(snapshot.newPackages === 1);
      assert(snapshot.totalPackages === 1);

      const nextTime = await ctx.model.Time.getTimeByString(nextDay);
      const nextSnapshot = await ctx.service.snapshot.lessonStat.buildDailySnapshot(nextTime);
      assert(nextSnapshot.period === 'daily');
      assert(nextSnapshot.newPackages === 1);
      assert(nextSnapshot.totalPackages === 2);
    });
  });

  describe('weekly snapshot', () => {
    const day = '2019-01-22';
    beforeEach(async () => {
      for (let i = 0; i < 14; i++) {
        const tempDate = moment(day).add(i, 'days').format('YYYY-MM-DD');

        await ctx.model.Package.createFromEvent({
          id: 12345 + i,
          userId: 123,
          createdAt: tempDate,
        });
        const time = await ctx.model.Time.getTimeByString(tempDate);
        await ctx.service.snapshot.lessonStat.buildDailySnapshot(time);
      }
    });

    it('should create a new weekly snapshot', async () => {
      const time = await ctx.model.Time.getTimeByString('2019-01-27');
      const snapshot = await ctx.service.snapshot.lessonStat.buildWeeklySnapshot(time);

      assert.ok(snapshot);
      assert(snapshot.period === 'weekly');
      assert(Number(snapshot.newPackages) === 6);
      assert(Number(snapshot.totalPackages) === 6);

      const nextTime = await ctx.model.Time.getTimeByString('2019-02-03');
      const nextSnapshot = await ctx.service.snapshot.lessonStat.buildWeeklySnapshot(nextTime);
      assert.ok(nextSnapshot);
      assert(nextSnapshot.period === 'weekly');
      assert(Number(nextSnapshot.newPackages) === 7);
      assert(Number(nextSnapshot.totalPackages) === 13);
    });
  });
  describe('monthly snapshot', () => {
    const day = '2019-01-01';
    beforeEach(async () => {
      for (let i = 0; i < 60; i++) {
        const tempDate = moment(day).add(i, 'days').format('YYYY-MM-DD');

        await ctx.model.Package.createFromEvent({
          id: 12345 + i,
          userId: 123,
          createdAt: tempDate,
        });
        const time = await ctx.model.Time.getTimeByString(tempDate);
        await ctx.service.snapshot.lessonStat.buildDailySnapshot(time);
      }
    });

    it('should create a new monthly snapshot', async () => {
      const time = await ctx.model.Time.getTimeByString('2019-01-31');
      const snapshot = await ctx.service.snapshot.lessonStat.buildMonthlySnapshot(time);

      assert(snapshot.period === 'monthly');
      assert(Number(snapshot.newPackages) === 31);
      assert(Number(snapshot.totalPackages) === 31);

      const nextTime = await ctx.model.Time.getTimeByString('2019-02-28');
      const nextSnapshot = await ctx.service.snapshot.lessonStat.buildMonthlySnapshot(nextTime);
      assert(nextSnapshot.period === 'monthly');
      assert(Number(nextSnapshot.newPackages) === 28);
      assert(Number(nextSnapshot.totalPackages) === 59);
    });
  });

  describe('build snapshot', () => {
    const day = '2019-01-01';
    beforeEach(async () => {
      for (let i = 0; i < 60; i++) {
        const tempDate = moment(day).add(i, 'days').format('YYYY-MM-DD');

        await ctx.model.Package.createFromEvent({
          id: 12345 + i,
          userId: 123,
          createdAt: tempDate,
        });
        if (i !== 0) {
          const time = await ctx.model.Time.getTimeByString(tempDate);
          await ctx.service.snapshot.lessonStat.build(time);
        }
      }
    });

    it('should build snapshots', async () => {
      const dailySnapCount = await ctx.model.LessonStatSnapshot.count({
        where: {
          period: 'daily',
        },
      });

      assert(dailySnapCount === 59);
      const weeklySnapCount = await ctx.model.LessonStatSnapshot.count({
        where: {
          period: 'weekly',
        },
      });

      assert(weeklySnapCount === 8);
      const monthlySnapCount = await ctx.model.LessonStatSnapshot.count({
        where: {
          period: 'monthly',
        },
      });

      assert(monthlySnapCount === 2);

      const dailySnapshot = await ctx.model.LessonStatSnapshot.findOne({
        where: {
          period: 'daily',
        },
        order: [[ 'id', 'DESC' ]],
      });
      assert(dailySnapshot.newPackages === 1);
      assert(dailySnapshot.totalPackages === 59);

      const weeklySnapshot = await ctx.model.LessonStatSnapshot.findOne({
        where: {
          period: 'weekly',
        },
        order: [[ 'id', 'DESC' ]],
      });
      assert(weeklySnapshot.newPackages === 7);
      assert(weeklySnapshot.totalPackages === 55);

      const monthlySnapshot = await ctx.model.LessonStatSnapshot.findOne({
        where: {
          period: 'monthly',
        },
        order: [[ 'id', 'DESC' ]],
      });
      assert(monthlySnapshot.newPackages === 28);
      assert(monthlySnapshot.totalPackages === 59);
    });
  });

});
