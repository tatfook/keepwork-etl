'use strict';

const Service = require('egg').Service;

class PackageLessonSnapshotService extends Service {
  async buildAll(day) {
    if (!day) throw new Error('Invalid params');
    const lastDay = await this.ctx.model.Time.getTimeByString(day.lastDayId());
    const limit = 100; // process 100 snapshot per loop
    let offset = 0;
    const attributes = [ 'lessonId', 'packageId' ];
    const where = {
      deletedAt: {
        $or: {
          $gt: lastDay.date,
          $eq: null,
        },
      },
    };
    let res = await this.ctx.model.PackageLesson.findAndCount({ attributes, where, limit, offset });
    const count = res.count;
    const packageLessons = res.rows;

    while (offset < count) {
      await Promise.all(packageLessons.map(pl => {
        return this.ctx.service.snapshot.packageLesson.build(pl.packageId, pl.lessonId, day);
      }));
      offset += limit;
      res = await this.ctx.model.PackageLesson.findAndCount({ attributes, where, limit, offset });
    }
  }

  async build(packageId, lessonId, day) {
    if (!day || !packageId || !lessonId) throw new Error('Invalid params');
    const lastDay = await this.ctx.model.Time.getTimeByString(day.lastDayId());
    await this.service.snapshot.packageLesson.buildDailySnapshot(packageId, lessonId, lastDay);
    if (day.isBeginOfWeek()) {
      // do weekly static for last week at the begin of this week
      await this.service.snapshot.packageLesson.buildWeeklySnapshot(packageId, lessonId, lastDay);
    }
    if (day.isBeginOfMonth()) {
      // do monthly static for last month at the begin of this month
      await this.service.snapshot.packageLesson.buildMonthlySnapshot(packageId, lessonId, lastDay);
    }
  }

  async buildDailySnapshot(packageId, lessonId, time) {
    const period = 'daily';
    const timeId = time.id;
    let lastSnapshot = await this.ctx.model.PackageLessonSnapshot.findOne({
      where: {
        timeId: time.lastDayId(),
        packageId,
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
        packageId,
        lessonId,
        beginTimeId: timeId,
      },
    });
    const newLearningCount = await this.ctx.model.LearningFact.count({
      where: {
        packageId,
        lessonId,
        beginTimeId: timeId,
      },
    });
    return await this.ctx.model.PackageLessonSnapshot.upsertWithData({
      period,
      timeId,
      packageId,
      lessonId,
      newTeachingCount,
      newLearningCount,
      teachingCount: Number(lastSnapshot.teachingCount) + Number(newTeachingCount),
      learningCount: Number(lastSnapshot.learningCount) + Number(newLearningCount),
    });
  }

  async buildWeeklySnapshot(packageId, lessonId, time) {
    const period = 'weekly';
    const timeId = time.id;
    const weekEndDaySnapshot = await this.ctx.model.PackageLessonSnapshot.findOne({
      where: {
        packageId,
        lessonId,
        timeId: time.weekEndDayId(),
        period: 'daily',
      },
    });
    if (!weekEndDaySnapshot) {
      throw new Error('Should build daily snapshot first!');
    }
    let lastSnapshot = await this.ctx.model.PackageLessonSnapshot.findOne({
      where: {
        packageId,
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

    return await this.ctx.model.PackageLessonSnapshot.upsertWithData({
      period,
      timeId,
      packageId,
      lessonId,
      newTeachingCount,
      newLearningCount,
      teachingCount: weekEndDaySnapshot.teachingCount,
      learningCount: weekEndDaySnapshot.learningCount,
    });
  }

  async buildMonthlySnapshot(packageId, lessonId, time) {
    const period = 'monthly';
    const timeId = time.id;
    const monthEndDaySnapshot = await this.ctx.model.PackageLessonSnapshot.findOne({
      where: {
        packageId,
        lessonId,
        timeId: time.monthEndDayId(),
        period: 'daily',
      },
    });
    if (!monthEndDaySnapshot) {
      throw new Error('Should build daily snapshot first!');
    }
    let lastSnapshot = await this.ctx.model.PackageLessonSnapshot.findOne({
      where: {
        packageId,
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

    return await this.ctx.model.PackageLessonSnapshot.upsertWithData({
      period,
      timeId,
      packageId,
      lessonId,
      newTeachingCount,
      newLearningCount,
      teachingCount: monthEndDaySnapshot.teachingCount,
      learningCount: monthEndDaySnapshot.learningCount,
    });
  }
}

module.exports = PackageLessonSnapshotService;
