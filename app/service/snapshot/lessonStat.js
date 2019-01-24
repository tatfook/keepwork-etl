'use strict';

const Service = require('egg').Service;

class LessonStatSnapshotService extends Service {
  async build(day) {
    if (!day) throw new Error('Invalid params');
    const lastDay = await this.ctx.model.Time.getTimeByString(day.lastDayId());
    await this.service.snapshot.lessonStat.buildDailySnapshot(lastDay);
    if (day.isBeginOfWeek()) {
      // do weekly static for last week at the begin of this week
      await this.service.snapshot.lessonStat.buildWeeklySnapshot(lastDay);
    }
    if (day.isBeginOfMonth()) {
      // do monthly static for last month at the begin of this month
      await this.service.snapshot.lessonStat.buildMonthlySnapshot(lastDay);
    }
  }

  async buildDailySnapshot(time) {
    const period = 'daily';
    const timeId = time.id;
    let lastSnapshot = await this.ctx.model.LessonStatSnapshot.findOne({
      where: {
        timeId: time.lastDayId(),
        period,
      },
    });
    if (!lastSnapshot) {
      lastSnapshot = {
        totalPackages: 0,
        totalPassedPackages: 0,
        totalReviewingPackages: 0,
        totalLessons: 0,
        totalQuestions: 0,
        totalTestQuestions: 0,
      };
    }
    const newTotalPackages = await this.ctx.model.Package.count({
      where: {
        createdAt: {
          $lt: time.nextDay,
        },
      },
    });
    const newTotalPassedPackages = await this.ctx.model.Package.count({
      where: {
        state: 2,
      },
    });
    const newTotalReviewingPackages = await this.ctx.model.Package.count({
      where: {
        state: 1,
      },
    });
    const newTotalLessons = await this.ctx.model.Lesson.count();
    const newTotalQuestions = await this.ctx.model.Question.count();
    const newTestQuestions = await this.ctx.model.TestQuestionFact.count({
      where: {
        timeId,
      },
    });

    return await this.ctx.model.LessonStatSnapshot.upsertWithData({
      period,
      timeId,
      totalPackages: newTotalPackages,
      newPackages: Number(newTotalPackages) - Number(lastSnapshot.totalPackages),
      totalPassedPackages: newTotalPassedPackages,
      newPassedPackages: Number(newTotalPassedPackages) - Number(lastSnapshot.totalPassedPackages),
      totalReviewingPackages: newTotalReviewingPackages,
      newReviewingPackages: Number(newTotalReviewingPackages) - Number(lastSnapshot.totalReviewingPackages),
      totalLessons: newTotalLessons,
      newLessons: Number(newTotalLessons) - Number(lastSnapshot.totalLessons),
      totalQuestions: newTotalQuestions,
      newQuestions: Number(newTotalQuestions) - Number(lastSnapshot.totalQuestions),
      totalTestQuestions: Number(lastSnapshot.totalTestQuestions) + Number(newTestQuestions),
      newTestQuestions,
    });
  }

  async buildWeeklySnapshot(time) {
    const period = 'weekly';
    const timeId = time.id;
    const weekEndDaySnapshot = await this.ctx.model.LessonStatSnapshot.findOne({
      where: {
        timeId: time.weekEndDayId(),
        period: 'daily',
      },
    });
    if (!weekEndDaySnapshot) {
      throw new Error('Should build daily snapshot first!');
    }
    let lastSnapshot = await this.ctx.model.LessonStatSnapshot.findOne({
      where: {
        timeId: time.lastWeekEndDayId(),
        period: 'weekly',
      },
    });
    if (!lastSnapshot) {
      lastSnapshot = {
        totalPackages: 0,
        totalPassedPackages: 0,
        totalReviewingPackages: 0,
        totalLessons: 0,
        totalQuestions: 0,
        totalTestQuestions: 0,
      };
    }

    const newPackages = Number(weekEndDaySnapshot.totalPackages) - Number(lastSnapshot.totalPackages);
    const newPassedPackages = Number(weekEndDaySnapshot.totalPassedPackages) - Number(lastSnapshot.totalPassedPackages);
    const newReviewingPackages = Number(weekEndDaySnapshot.totalReviewingPackages) - Number(lastSnapshot.totalReviewingPackages);
    const newLessons = Number(weekEndDaySnapshot.totalLessons) - Number(lastSnapshot.totalLessons);
    const newQuestions = Number(weekEndDaySnapshot.totalQuestions) - Number(lastSnapshot.totalQuestions);
    const newTestQuestions = Number(weekEndDaySnapshot.totalTestQuestions) - Number(lastSnapshot.totalTestQuestions);

    return await this.ctx.model.LessonStatSnapshot.upsertWithData({
      period,
      timeId,
      totalPackages: weekEndDaySnapshot.totalPackages,
      newPackages,
      totalPassedPackages: weekEndDaySnapshot.totalPassedPackages,
      newPassedPackages,
      totalReviewingPackages: weekEndDaySnapshot.totalReviewingPackages,
      newReviewingPackages,
      totalLessons: weekEndDaySnapshot.totalLessons,
      newLessons,
      totalQuestions: weekEndDaySnapshot.totalQuestions,
      newQuestions,
      totalTestQuestions: weekEndDaySnapshot.totalTestQuestions,
      newTestQuestions,
    });
  }

  async buildMonthlySnapshot(time) {
    const period = 'monthly';
    const timeId = time.id;
    const monthEndDaySnapshot = await this.ctx.model.LessonStatSnapshot.findOne({
      where: {
        timeId: time.monthEndDayId(),
        period: 'daily',
      },
    });
    if (!monthEndDaySnapshot) {
      throw new Error('Should build daily snapshot first!');
    }
    let lastSnapshot = await this.ctx.model.LessonStatSnapshot.findOne({
      where: {
        timeId: time.lastMonthEndDayId(),
        period: 'monthly',
      },
    });
    if (!lastSnapshot) {
      lastSnapshot = {
        totalPackages: 0,
        totalPassedPackages: 0,
        totalReviewingPackages: 0,
        totalLessons: 0,
        totalQuestions: 0,
        totalTestQuestions: 0,
      };
    }

    const newPackages = Number(monthEndDaySnapshot.totalPackages) - Number(lastSnapshot.totalPackages);
    const newPassedPackages = Number(monthEndDaySnapshot.totalPassedPackages) - Number(lastSnapshot.totalPassedPackages);
    const newReviewingPackages = Number(monthEndDaySnapshot.totalReviewingPackages) - Number(lastSnapshot.totalReviewingPackages);
    const newLessons = Number(monthEndDaySnapshot.totalLessons) - Number(lastSnapshot.totalLessons);
    const newQuestions = Number(monthEndDaySnapshot.totalQuestions) - Number(lastSnapshot.totalQuestions);
    const newTestQuestions = Number(monthEndDaySnapshot.totalTestQuestions) - Number(lastSnapshot.totalTestQuestions);

    return await this.ctx.model.LessonStatSnapshot.upsertWithData({
      period,
      timeId,
      totalPackages: monthEndDaySnapshot.totalPackages,
      newPackages,
      totalPassedPackages: monthEndDaySnapshot.totalPassedPackages,
      newPassedPackages,
      totalReviewingPackages: monthEndDaySnapshot.totalReviewingPackages,
      newReviewingPackages,
      totalLessons: monthEndDaySnapshot.totalLessons,
      newLessons,
      totalQuestions: monthEndDaySnapshot.totalQuestions,
      newQuestions,
      totalTestQuestions: monthEndDaySnapshot.totalTestQuestions,
      newTestQuestions,
    });
  }
}

module.exports = LessonStatSnapshotService;
