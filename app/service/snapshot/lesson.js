'use strict';

const Service = require('egg').Service;

class LessonSnapshotService extends Service {
  async buildAll(day) {
    if (!day) throw new Error('Invalid params'); // day = await this.ctx.model.Time.today();
    const limit = 100; // process 100 snapshot per loop
    let offset = 0;
    const attributes = [ 'id' ];
    let res = await this.ctx.model.Lesson.findAndCount({
      attributes,
      limit,
      offset,
    });
    const count = res.count;
    const lessons = res.rows;

    while (offset < count) {
      await Promise.all(lessons.map(l => {
        return this.ctx.service.snapshot.lesson.build(l.id, day);
      }));
      offset += limit;
      res = await this.ctx.model.Lesson.findAndCount({
        attributes,
        limit,
        offset,
      });
    }
  }

  async build(lessonId, day) {
    if (!day || !lessonId) throw new Error('Invalid params');
    const lastDay = await this.ctx.model.Time.getTimeByString(day.lastDayId());
    await this.service.snapshot.lesson.buildDailySnapshot(lessonId, lastDay);
    if (day.isBeginOfWeek()) {
      // do weekly static for last week at the begin of this week
      await this.service.snapshot.lesson.buildWeeklySnapshot(lessonId, lastDay);
    }
    if (day.isBeginOfMonth()) {
      // do monthly static for last month at the begin of this month
      await this.service.snapshot.lesson.buildMonthlySnapshot(lessonId, lastDay);
    }
  }

  async buildDailySnapshot(lessonId, time) {
    const period = 'daily';
    const timeId = time.id;
    let lastSnapshot = await this.ctx.model.LessonSnapshot.findOne({
      where: {
        timeId: time.lastDayId(),
        lessonId,
        period,
      },
    });
    if (!lastSnapshot) {
      lastSnapshot = {
        teachingCount: 0,
        learningCount: 0,
      };
    }
    const newTeachingCount = await this.ctx.model.ClassroomFact.count({
      where: {
        lessonId,
        beginTimeId: timeId,
      },
    });
    const newLearningCount = await this.ctx.model.LearningFact.count({
      where: {
        lessonId,
        beginTimeId: timeId,
      },
    });
    return await this.ctx.model.LessonSnapshot.upsertWithData({
      period,
      timeId,
      lessonId,
      newTeachingCount,
      newLearningCount,
      teachingCount: Number(lastSnapshot.teachingCount) + Number(newTeachingCount),
      learningCount: Number(lastSnapshot.learningCount) + Number(newLearningCount),
    });
  }

  async buildWeeklySnapshot(lessonId, time) {
    const period = 'weekly';
    const timeId = time.id;
    const weekEndDaySnapshot = await this.ctx.model.LessonSnapshot.findOne({
      where: {
        lessonId,
        timeId: time.weekEndDayId(),
        period: 'daily',
      },
    });
    if (!weekEndDaySnapshot) {
      throw new Error('Should build daily snapshot first!');
    }
    let lastSnapshot = await this.ctx.model.LessonSnapshot.findOne({
      where: {
        lessonId,
        timeId: time.lastWeekEndDayId(),
        period: 'weekly',
      },
    });
    if (!lastSnapshot) {
      lastSnapshot = {
        teachingCount: 0,
        learningCount: 0,
      };
    }

    const newTeachingCount = Number(weekEndDaySnapshot.teachingCount) - Number(lastSnapshot.teachingCount);
    const newLearningCount = Number(weekEndDaySnapshot.learningCount) - Number(lastSnapshot.learningCount);

    return await this.ctx.model.LessonSnapshot.upsertWithData({
      period,
      timeId,
      lessonId,
      newTeachingCount,
      newLearningCount,
      teachingCount: weekEndDaySnapshot.teachingCount,
      learningCount: weekEndDaySnapshot.learningCount,
    });
  }

  async buildMonthlySnapshot(lessonId, time) {
    const period = 'monthly';
    const timeId = time.id;
    const monthEndDaySnapshot = await this.ctx.model.LessonSnapshot.findOne({
      where: {
        lessonId,
        timeId: time.monthEndDayId(),
        period: 'daily',
      },
    });
    if (!monthEndDaySnapshot) {
      throw new Error('Should build daily snapshot first!');
    }
    let lastSnapshot = await this.ctx.model.LessonSnapshot.findOne({
      where: {
        lessonId,
        timeId: time.lastMonthEndDayId(),
        period: 'monthly',
      },
    });
    if (!lastSnapshot) {
      lastSnapshot = {
        teachingCount: 0,
        learningCount: 0,
      };
    }

    const newTeachingCount = Number(monthEndDaySnapshot.teachingCount) - Number(lastSnapshot.teachingCount);
    const newLearningCount = Number(monthEndDaySnapshot.learningCount) - Number(lastSnapshot.learningCount);

    return await this.ctx.model.LessonSnapshot.upsertWithData({
      period,
      timeId,
      lessonId,
      newTeachingCount,
      newLearningCount,
      teachingCount: monthEndDaySnapshot.teachingCount,
      learningCount: monthEndDaySnapshot.learningCount,
    });
  }
}

module.exports = LessonSnapshotService;
