'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const moment = require('moment');

describe('test/app/service/snapshot/package.test.js', () => {
  let ctx;
  //   let error;
  beforeEach(async () => {
    // error = undefined;
    ctx = app.mockContext();
    await ctx.model.User.createFromEvent({ id: 123 });
    await ctx.model.User.createFromEvent({ id: 12345 });
    await app.model.Package.createFromEvent({
      id: 12345,
      userId: 123,
    });
    await app.model.Package.createFromEvent({
      id: 12346,
      userId: 123,
    });
    await app.model.Lesson.createFromEvent({
      id: 12345,
      userId: 123,
    });
  });

  describe('daily snapshot', () => {
    const day = '2019-01-09';
    const nextDay = '2019-01-10';
    beforeEach(async () => {
      await ctx.service.fact.package.commonOperate({
        category: 'keepwork',
        action: 'subscribe_package',
        data: {
          operateAt: day,
          userId: 123,
          packageId: 12345,
        },
      });
      await ctx.service.fact.package.commonOperate({
        category: 'keepwork',
        action: 'subscribe_package',
        data: {
          operateAt: nextDay,
          userId: 12345,
          packageId: 12345,
        },
      });
    });

    it('should create a new daily snapshot', async () => {
      const time = await ctx.model.Time.getTimeByString(day);
      const p = await ctx.model.Package.findOne({ attributes: [ 'id' ] });
      const snapshot = await ctx.service.snapshot.package.buildDailySnapshot(p.id, time);

      assert(snapshot.period === 'daily');
      assert(snapshot.newSubscribeCount === 1);
      assert(snapshot.subscribeCount === 1);
      assert(snapshot.newTeachingCount === 0);

      const nextTime = await ctx.model.Time.getTimeByString(nextDay);
      const nextSnapshot = await ctx.service.snapshot.package.buildDailySnapshot(p.id, nextTime);
      assert(nextSnapshot.period === 'daily');
      assert(nextSnapshot.newSubscribeCount === 1);
      assert(nextSnapshot.subscribeCount === 2);
    });
  });

  describe('weekly snapshot', () => {
    const day = '2019-01-22';
    beforeEach(async () => {
      const p = await ctx.model.Package.findOne({ attributes: [ 'id' ] });
      for (let i = 0; i < 14; i++) {
        const tempDate = moment(day).add(i, 'days').format('YYYY-MM-DD');
        await ctx.service.fact.learning.beginClass({
          category: 'keepwork',
          action: 'begin_class',
          data: {
            classroomKey: 12345 + i,
            beginAt: tempDate,
            teacherId: 123,
            packageId: 12345,
            lessonId: 12345,
          },
        });
        const time = await ctx.model.Time.getTimeByString(tempDate);
        await ctx.service.snapshot.package.buildDailySnapshot(p.id, time);
      }
    });

    it('should create a new weekly snapshot', async () => {
      const time = await ctx.model.Time.getTimeByString('2019-01-27');
      const p = await ctx.model.Package.findOne({ attributes: [ 'id' ] });
      const snapshot = await ctx.service.snapshot.package.buildWeeklySnapshot(p.id, time);

      assert.ok(snapshot);
      assert(snapshot.period === 'weekly');
      assert(Number(snapshot.newTeachingCount) === 6);
      assert(Number(snapshot.teachingCount) === 6);
      assert(Number(snapshot.newSubscribeCount) === 0);
      assert(Number(snapshot.subscribeCount) === 0);

      const nextTime = await ctx.model.Time.getTimeByString('2019-02-03');
      const nextSnapshot = await ctx.service.snapshot.package.buildWeeklySnapshot(p.id, nextTime);
      assert.ok(nextSnapshot);
      assert(nextSnapshot.period === 'weekly');
      assert(Number(nextSnapshot.newTeachingCount) === 7);
      assert(Number(nextSnapshot.teachingCount) === 13);
      assert(Number(nextSnapshot.newSubscribeCount) === 0);
      assert(Number(nextSnapshot.subscribeCount) === 0);
    });
  });
  describe('monthly snapshot', () => {
    const day = '2019-01-01';
    beforeEach(async () => {
      const p = await ctx.model.Package.findOne({ attributes: [ 'id' ] });
      for (let i = 0; i < 60; i++) {
        const tempDate = moment(day).add(i, 'days').format('YYYY-MM-DD');
        await ctx.service.fact.learning.beginClass({
          category: 'keepwork',
          action: 'begin_class',
          data: {
            classroomKey: 12345 + i,
            beginAt: tempDate,
            teacherId: 123,
            packageId: 12345,
            lessonId: 12345,
          },
        });
        const time = await ctx.model.Time.getTimeByString(tempDate);
        await ctx.service.snapshot.package.buildDailySnapshot(p.id, time);
      }
    });

    it('should create a new monthly snapshot', async () => {
      const time = await ctx.model.Time.getTimeByString('2019-01-31');
      const p = await ctx.model.Package.findOne({ attributes: [ 'id' ] });
      const snapshot = await ctx.service.snapshot.package.buildMonthlySnapshot(p.id, time);

      assert(snapshot.period === 'monthly');
      assert(Number(snapshot.newTeachingCount) === 31);
      assert(Number(snapshot.teachingCount) === 31);
      assert(Number(snapshot.newSubscribeCount) === 0);
      assert(Number(snapshot.subscribeCount) === 0);

      const nextTime = await ctx.model.Time.getTimeByString('2019-02-28');
      const nextSnapshot = await ctx.service.snapshot.package.buildMonthlySnapshot(p.id, nextTime);
      assert(nextSnapshot.period === 'monthly');
      assert(Number(nextSnapshot.newTeachingCount) === 28);
      assert(Number(nextSnapshot.teachingCount) === 59);
      assert(Number(nextSnapshot.newSubscribeCount) === 0);
      assert(Number(nextSnapshot.subscribeCount) === 0);
    });
  });

  describe('build snapshot', () => {
    const day = '2019-01-01';
    beforeEach(async () => {
      const p = await ctx.model.Package.findOne({ attributes: [ 'id' ] });
      for (let i = 0; i < 60; i++) {
        const tempDate = moment(day).add(i, 'days').format('YYYY-MM-DD');
        await ctx.service.fact.learning.beginClass({
          category: 'keepwork',
          action: 'begin_class',
          data: {
            classroomKey: 12345 + i,
            beginAt: tempDate,
            teacherId: 123,
            packageId: 12345,
            lessonId: 12345,
          },
        });
        if (i !== 0) {
          const time = await ctx.model.Time.getTimeByString(tempDate);
          await ctx.service.snapshot.package.build(p.id, time);
        }
      }
    });

    it('should build snapshots', async () => {
      const p = await ctx.model.Package.findOne({ attributes: [ 'id' ] });
      const dailySnapCount = await ctx.model.PackageSnapshot.count({
        where: {
          packageId: p.id,
          period: 'daily',
        },
      });

      assert(dailySnapCount === 59);
      const weeklySnapCount = await ctx.model.PackageSnapshot.count({
        where: {
          packageId: p.id,
          period: 'weekly',
        },
      });

      assert(weeklySnapCount === 8);
      const monthlySnapCount = await ctx.model.PackageSnapshot.count({
        where: {
          packageId: p.id,
          period: 'monthly',
        },
      });

      assert(monthlySnapCount === 2);

      const dailySnapshot = await ctx.model.PackageSnapshot.findOne({
        where: {
          packageId: p.id,
          period: 'daily',
        },
        order: [[ 'id', 'DESC' ]],
      });
      assert(dailySnapshot.newTeachingCount === 1);
      assert(dailySnapshot.teachingCount === 59);

      const weeklySnapshot = await ctx.model.PackageSnapshot.findOne({
        where: {
          packageId: p.id,
          period: 'weekly',
        },
        order: [[ 'id', 'DESC' ]],
      });
      assert(weeklySnapshot.newTeachingCount === 7);
      assert(weeklySnapshot.teachingCount === 55);

      const monthlySnapshot = await ctx.model.PackageSnapshot.findOne({
        where: {
          packageId: p.id,
          period: 'monthly',
        },
        order: [[ 'id', 'DESC' ]],
      });
      assert(monthlySnapshot.newTeachingCount === 28);
      assert(monthlySnapshot.teachingCount === 59);
    });
  });

  describe('build all snapshot', () => {
    const day = '2019-01-09';
    const nextDay = '2019-01-10';
    beforeEach(async () => {
      await ctx.service.fact.learning.beginClass({
        category: 'keepwork',
        action: 'begin_class',
        data: {
          classroomKey: 12345,
          beginAt: day,
          teacherId: 123,
          packageId: 12345,
          lessonId: 12345,
        },
      });
      await ctx.service.fact.learning.beginClass({
        category: 'keepwork',
        action: 'begin_class',
        data: {
          classroomKey: 22345,
          beginAt: day,
          teacherId: 123,
          packageId: 12346,
          lessonId: 12345,
        },
      });
      const time = await ctx.model.Time.getTimeByString(nextDay);
      await ctx.service.snapshot.package.buildAll(time);
    });

    it('should build snapshots', async () => {
      const count = await ctx.model.PackageSnapshot.count({ where: { period: 'daily' } });
      assert(count === 2);

      let p = await ctx.model.Package.findOne({ attributes: [ 'id' ] });
      let dailySnapCount = await ctx.model.PackageSnapshot.count({
        where: {
          packageId: p.id,
          period: 'daily',
        },
      });

      assert(dailySnapCount === 1);
      p = await ctx.model.Package.findOne({ attributes: [ 'id' ], order: [[ 'id', 'desc' ]] });
      dailySnapCount = await ctx.model.PackageSnapshot.count({
        where: {
          packageId: p.id,
          period: 'daily',
        },
      });

      assert(dailySnapCount === 1);
    });
  });
});
