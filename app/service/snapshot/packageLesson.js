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

    const snapshot = await this.ctx.model.PackageLessonSnapshot.findOrCreate({
      where: {
        period,
        timeId,
        packageId,
        lessonId,
      },
    });
    return await snapshot[0].update({
      newTeachingCount,
      newLearningCount,
      teachingCount: Number(lastSnapshot.teachingCount) + Number(newTeachingCount),
      learningCount: Number(lastSnapshot.learningCount) + Number(newLearningCount),
    });
  }

  async buildWeeklySnapshot(packageId, lessonId, time) {
    const { fn, col } = this.ctx.app.Sequelize;
    const period = 'weekly';
    const timeId = time.id;
    let lastSnapshot = await this.ctx.model.PackageLessonSnapshot.findOne({
      where: {
        timeId: time.lastWeekId(),
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
    const res = await this.ctx.model.PackageLessonSnapshot.findAll({
      attributes: [
        [ fn('SUM', col('newTeachingCount')), 'newTeachingCount' ],
        [ fn('SUM', col('newLearningCount')), 'newLearningCount' ],
      ],
      where: {
        packageId,
        lessonId,
        period: 'daily',
      },
      include: [{
        model: this.ctx.model.Time,
        attributes: [ ],
        where: {
          week: time.week,
          year: time.year,
        },
      }],
      group: [ 'package_lesson_snapshots.lessonId' ],
    });
    const newTeachingCount = res[0].newTeachingCount;
    const newLearningCount = res[0].newLearningCount;

    const snapshot = await this.ctx.model.PackageLessonSnapshot.findOrCreate({
      where: {
        period,
        timeId,
        packageId,
        lessonId,
      },
    });

    return await snapshot[0].update({
      newTeachingCount,
      newLearningCount,
      teachingCount: Number(lastSnapshot.teachingCount) + Number(newTeachingCount),
      learningCount: Number(lastSnapshot.learningCount) + Number(newLearningCount),
    });
  }

  async buildMonthlySnapshot(packageId, lessonId, time) {
    const { fn, col } = this.ctx.app.Sequelize;
    const period = 'monthly';
    const timeId = time.id;
    let lastSnapshot = await this.ctx.model.PackageLessonSnapshot.findOne({
      where: {
        timeId: time.lastMonthId(),
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
    const res = await this.ctx.model.PackageLessonSnapshot.findAll({
      attributes: [
        [ fn('SUM', col('newTeachingCount')), 'newTeachingCount' ],
        [ fn('SUM', col('newLearningCount')), 'newLearningCount' ],
      ],
      where: {
        packageId,
        lessonId,
        period: 'daily',
      },
      include: [{
        model: this.ctx.model.Time,
        attributes: [ ],
        where: {
          year: time.year,
          month: time.month,
        },
      }],
      group: [ 'package_lesson_snapshots.lessonId' ],
    });
    const newTeachingCount = res[0].newTeachingCount;
    const newLearningCount = res[0].newLearningCount;

    const snapshot = await this.ctx.model.PackageLessonSnapshot.findOrCreate({
      where: {
        period,
        timeId,
        packageId,
        lessonId,
      },
    });

    return await snapshot[0].update({
      newTeachingCount,
      newLearningCount,
      teachingCount: Number(lastSnapshot.teachingCount) + Number(newTeachingCount),
      learningCount: Number(lastSnapshot.learningCount) + Number(newLearningCount),
    });
  }
}

module.exports = PackageLessonSnapshotService;
