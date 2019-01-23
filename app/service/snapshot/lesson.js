'use strict';

const Service = require('egg').Service;

class LessonSnapshotService extends Service {
  async build(lessonId, day) {
    if (!day) day = await this.ctx.model.Time.today();
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

    const snapshot = await this.ctx.model.LessonSnapshot.findOrCreate({
      where: {
        period,
        timeId,
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

  async buildWeeklySnapshot(lessonId, time) {
    const { fn, col } = this.ctx.app.Sequelize;
    const period = 'weekly';
    const timeId = time.id;
    let lastSnapshot = await this.ctx.model.LessonSnapshot.findOne({
      where: {
        timeId: time.lastWeekId(),
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
    const res = await this.ctx.model.LessonSnapshot.findAll({
      attributes: [
        [ fn('SUM', col('newTeachingCount')), 'newTeachingCount' ],
        [ fn('SUM', col('newLearningCount')), 'newLearningCount' ],
      ],
      where: {
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
      group: [ 'lesson_snapshots.lessonId' ],
    });
    const newTeachingCount = res[0].newTeachingCount;
    const newLearningCount = res[0].newLearningCount;

    const snapshot = await this.ctx.model.LessonSnapshot.findOrCreate({
      where: {
        period,
        timeId,
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

  async buildMonthlySnapshot(lessonId, time) {
    const { fn, col } = this.ctx.app.Sequelize;
    const period = 'monthly';
    const timeId = time.id;
    let lastSnapshot = await this.ctx.model.LessonSnapshot.findOne({
      where: {
        timeId: time.lastMonthId(),
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
    const res = await this.ctx.model.LessonSnapshot.findAll({
      attributes: [
        [ fn('SUM', col('newTeachingCount')), 'newTeachingCount' ],
        [ fn('SUM', col('newLearningCount')), 'newLearningCount' ],
      ],
      where: {
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
      group: [ 'lesson_snapshots.lessonId' ],
    });
    const newTeachingCount = res[0].newTeachingCount;
    const newLearningCount = res[0].newLearningCount;

    const snapshot = await this.ctx.model.LessonSnapshot.findOrCreate({
      where: {
        period,
        timeId,
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

module.exports = LessonSnapshotService;
