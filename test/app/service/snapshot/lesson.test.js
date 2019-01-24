'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const moment = require('moment');

describe('test/app/service/snapshot/lesson.test.js', () => {
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
    await app.model.Lesson.createFromEvent({
      id: 12346,
      userId: 123,
    });
  });

  describe('daily snapshot', () => {
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
          classroomKey: 12346,
          beginAt: nextDay,
          teacherId: 123,
          packageId: 12345,
          lessonId: 12345,
        },
      });
      await ctx.service.fact.learning.beginClass({
        category: 'keepwork',
        action: 'begin_class',
        data: {
          classroomKey: 12349,
          beginAt: day,
          teacherId: 123,
          packageId: 12346,
          lessonId: 12345,
        },
      });
      await ctx.service.fact.learning.beginClass({
        category: 'keepwork',
        action: 'begin_class',
        data: {
          classroomKey: 12350,
          beginAt: nextDay,
          teacherId: 123,
          packageId: 12346,
          lessonId: 12345,
        },
      });
      await ctx.service.fact.learning.beginClass({
        category: 'keepwork',
        action: 'begin_class',
        data: {
          classroomKey: 12347,
          beginAt: day,
          teacherId: 123,
          packageId: 12345,
          lessonId: 12346,
        },
      });
      await ctx.service.fact.learning.beginClass({
        category: 'keepwork',
        action: 'begin_class',
        data: {
          classroomKey: 12348,
          beginAt: nextDay,
          teacherId: 123,
          packageId: 12345,
          lessonId: 12346,
        },
      });
    });

    it('should create a new daily snapshot', async () => {
      const time = await ctx.model.Time.getTimeByString(day);
      const l = await ctx.model.Lesson.findOne({ attributes: [ 'id' ] });
      const snapshot = await ctx.service.snapshot.lesson.buildDailySnapshot(l.id, time);

      assert(snapshot.period === 'daily');
      assert(snapshot.newTeachingCount === 2);
      assert(snapshot.teachingCount === 2);

      const nextTime = await ctx.model.Time.getTimeByString(nextDay);
      const nextSnapshot = await ctx.service.snapshot.lesson.buildDailySnapshot(l.id, nextTime);
      assert(nextSnapshot.period === 'daily');
      assert(nextSnapshot.newTeachingCount === 2);
      assert(nextSnapshot.teachingCount === 4);
    });

    it('should create a new daily snapshot for another lesson', async () => {
      const time = await ctx.model.Time.getTimeByString(day);
      const l = await ctx.model.Lesson.findOne({ attributes: [ 'id' ], order: [[ 'id', 'desc' ]] });
      const snapshot = await ctx.service.snapshot.lesson.buildDailySnapshot(l.id, time);

      assert(snapshot.period === 'daily');
      assert(snapshot.newTeachingCount === 1);
      assert(snapshot.teachingCount === 1);

      const nextTime = await ctx.model.Time.getTimeByString(nextDay);
      const nextSnapshot = await ctx.service.snapshot.lesson.buildDailySnapshot(l.id, nextTime);
      assert(nextSnapshot.period === 'daily');
      assert(nextSnapshot.newTeachingCount === 1);
      assert(nextSnapshot.teachingCount === 2);
    });
  });

  describe('weekly snapshot', () => {
    const day = '2019-01-22';
    beforeEach(async () => {
      const l = await ctx.model.Lesson.findOne({ attributes: [ 'id' ] });
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
        await ctx.service.snapshot.lesson.buildDailySnapshot(l.id, time);
      }
    });

    it('should create a new weekly snapshot', async () => {
      const time = await ctx.model.Time.getTimeByString('2019-01-27');
      const l = await ctx.model.Lesson.findOne({ attributes: [ 'id' ] });
      const snapshot = await ctx.service.snapshot.lesson.buildWeeklySnapshot(l.id, time);

      assert.ok(snapshot);
      assert(snapshot.period === 'weekly');
      assert(Number(snapshot.newTeachingCount) === 6);
      assert(Number(snapshot.teachingCount) === 6);
      assert(Number(snapshot.newLearningCount) === 0);
      assert(Number(snapshot.learningCount) === 0);

      const nextTime = await ctx.model.Time.getTimeByString('2019-02-03');
      const nextSnapshot = await ctx.service.snapshot.lesson.buildWeeklySnapshot(l.id, nextTime);
      assert.ok(nextSnapshot);
      assert(nextSnapshot.period === 'weekly');
      assert(Number(nextSnapshot.newTeachingCount) === 7);
      assert(Number(nextSnapshot.teachingCount) === 13);
      assert(Number(nextSnapshot.newLearningCount) === 0);
      assert(Number(nextSnapshot.learningCount) === 0);
    });
  });
  describe('monthly snapshot', () => {
    const day = '2019-01-01';
    beforeEach(async () => {
      const l = await ctx.model.Lesson.findOne({ attributes: [ 'id' ] });
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
        await ctx.service.snapshot.lesson.buildDailySnapshot(l.id, time);
      }
    });

    it('should create a new monthly snapshot', async () => {
      const time = await ctx.model.Time.getTimeByString('2019-01-31');
      const l = await ctx.model.Lesson.findOne({ attributes: [ 'id' ] });
      const snapshot = await ctx.service.snapshot.lesson.buildMonthlySnapshot(l.id, time);

      assert(snapshot.period === 'monthly');
      assert(Number(snapshot.newTeachingCount) === 31);
      assert(Number(snapshot.teachingCount) === 31);
      assert(Number(snapshot.newLearningCount) === 0);
      assert(Number(snapshot.learningCount) === 0);

      const nextTime = await ctx.model.Time.getTimeByString('2019-02-28');
      const nextSnapshot = await ctx.service.snapshot.lesson.buildMonthlySnapshot(l.id, nextTime);
      assert(nextSnapshot.period === 'monthly');
      assert(Number(nextSnapshot.newTeachingCount) === 28);
      assert(Number(nextSnapshot.teachingCount) === 59);
      assert(Number(nextSnapshot.newLearningCount) === 0);
      assert(Number(nextSnapshot.learningCount) === 0);
    });
  });

  describe('build snapshot', () => {
    const day = '2019-01-01';
    beforeEach(async () => {
      const l = await ctx.model.Lesson.findOne({ attributes: [ 'id' ] });
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
          await ctx.service.snapshot.lesson.build(l.id, time);
        }
      }
    });

    it('should build snapshots', async () => {
      const l = await ctx.model.Lesson.findOne({ attributes: [ 'id' ] });
      const dailySnapCount = await ctx.model.LessonSnapshot.count({
        where: {
          lessonId: l.id,
          period: 'daily',
        },
      });

      assert(dailySnapCount === 59);
      const weeklySnapCount = await ctx.model.LessonSnapshot.count({
        where: {
          lessonId: l.id,
          period: 'weekly',
        },
      });

      assert(weeklySnapCount === 8);
      const monthlySnapCount = await ctx.model.LessonSnapshot.count({
        where: {
          lessonId: l.id,
          period: 'monthly',
        },
      });

      assert(monthlySnapCount === 2);

      const dailySnapshot = await ctx.model.LessonSnapshot.findOne({
        where: {
          lessonId: l.id,
          period: 'daily',
        },
        order: [[ 'id', 'DESC' ]],
      });
      assert(dailySnapshot.newTeachingCount === 1);
      assert(dailySnapshot.teachingCount === 59);

      const weeklySnapshot = await ctx.model.LessonSnapshot.findOne({
        where: {
          lessonId: l.id,
          period: 'weekly',
        },
        order: [[ 'id', 'DESC' ]],
      });
      assert(weeklySnapshot.newTeachingCount === 7);
      assert(weeklySnapshot.teachingCount === 55);

      const monthlySnapshot = await ctx.model.LessonSnapshot.findOne({
        where: {
          lessonId: l.id,
          period: 'monthly',
        },
        order: [[ 'id', 'DESC' ]],
      });
      assert(monthlySnapshot.newTeachingCount === 28);
      assert(monthlySnapshot.teachingCount === 59);
    });
  });

  describe('build all snapshot', () => {
    const day = '2019-01-02';
    const nextDay = '2019-01-03';
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
          packageId: 12345,
          lessonId: 12346,
        },
      });
      const time = await ctx.model.Time.getTimeByString(nextDay);
      await ctx.service.snapshot.lesson.buildAll(time);
    });

    it('should build snapshots', async () => {
      const count = await ctx.model.LessonSnapshot.count({ where: { period: 'daily' } });
      assert(count === 2);

      let l = await ctx.model.Lesson.findOne({ attributes: [ 'id' ] });
      let dailySnapCount = await ctx.model.LessonSnapshot.count({
        where: {
          lessonId: l.id,
          period: 'daily',
        },
      });

      assert(dailySnapCount === 1);
      l = await ctx.model.Lesson.findOne({ attributes: [ 'id' ], order: [[ 'id', 'desc' ]] });
      dailySnapCount = await ctx.model.LessonSnapshot.count({
        where: {
          lessonId: l.id,
          period: 'daily',
        },
      });

      assert(dailySnapCount === 1);
    });
  });
});
