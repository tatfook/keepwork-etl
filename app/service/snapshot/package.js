'use strict';

const Service = require('egg').Service;

class PackageSnapshotService extends Service {
  async buildAll(day) {
    if (!day) throw new Error('Invalid params');
    const limit = 100; // process 100 snapshot per loop
    let offset = 0;
    const attributes = [ 'id' ];
    let res = await this.ctx.model.Package.findAndCount({ attributes, limit, offset });
    const count = res.count;
    const packages = res.rows;

    while (offset < count) {
      await Promise.all(packages.map(p => {
        return this.ctx.service.snapshot.package.build(p.id, day);
      }));
      offset += limit;
      res = await this.ctx.model.Package.findAndCount({ attributes, limit, offset });
    }
  }

  async build(packageId, day) {
    if (!day || !packageId) throw new Error('Invalid params');
    const lastDay = await this.ctx.model.Time.getTimeByString(day.lastDayId());
    await this.service.snapshot.package.buildDailySnapshot(packageId, lastDay);
    if (day.isBeginOfWeek()) {
      // do weekly static for last week at the begin of this week
      await this.service.snapshot.package.buildWeeklySnapshot(packageId, lastDay);
    }
    if (day.isBeginOfMonth()) {
      // do monthly static for last month at the begin of this month
      await this.service.snapshot.package.buildMonthlySnapshot(packageId, lastDay);
    }
  }

  async buildDailySnapshot(packageId, time) {
    const period = 'daily';
    const timeId = time.id;
    let lastSnapshot = await this.ctx.model.PackageSnapshot.findOne({
      where: {
        timeId: time.lastDayId(),
        packageId,
        period,
      },
    });
    if (!lastSnapshot) {
      lastSnapshot = {
        subscribeCount: 0,
        teachingCount: 0,
        learningCount: 0,
      };
    }
    const newSubscribeCount = await this.ctx.model.PackageFact.count({
      where: {
        packageId,
        timeId,
        action: 'subscribe_package',
      },
    });
    const newTeachingCount = await this.ctx.model.ClassroomFact.count({
      where: {
        packageId,
        beginTimeId: timeId,
      },
    });
    const newLearningCount = await this.ctx.model.LearningFact.count({
      where: {
        packageId,
        beginTimeId: timeId,
      },
    });
    return await this.ctx.model.PackageSnapshot.upsertWithData({
      period,
      timeId,
      packageId,
      newSubscribeCount,
      newTeachingCount,
      newLearningCount,
      subscribeCount: Number(lastSnapshot.subscribeCount) + Number(newSubscribeCount),
      teachingCount: Number(lastSnapshot.teachingCount) + Number(newTeachingCount),
      learningCount: Number(lastSnapshot.learningCount) + Number(newLearningCount),
    });
  }

  async buildWeeklySnapshot(packageId, time) {
    const period = 'weekly';
    const timeId = time.id;
    const weekEndDaySnapshot = await this.ctx.model.PackageSnapshot.findOne({
      where: {
        packageId,
        timeId: time.weekEndDayId(),
        period: 'daily',
      },
    });
    if (!weekEndDaySnapshot) {
      return await this.ctx.model.PackageSnapshot.upsertWithData({
        period,
        timeId,
        packageId,
        newSubscribeCount: 0,
        newTeachingCount: 0,
        newLearningCount: 0,
        teachingCount: 0,
        learningCount: 0,
        subscribeCount: 0,
      });
    }
    let lastSnapshot = await this.ctx.model.PackageSnapshot.findOne({
      where: {
        packageId,
        timeId: time.lastWeekEndDayId(),
        period: 'weekly',
      },
    });
    if (!lastSnapshot) {
      lastSnapshot = {
        teachingCount: 0,
        learningCount: 0,
        subscribeCount: 0,
      };
    }

    const newTeachingCount = Number(weekEndDaySnapshot.teachingCount) - Number(lastSnapshot.teachingCount);
    const newLearningCount = Number(weekEndDaySnapshot.learningCount) - Number(lastSnapshot.learningCount);
    const newSubscribeCount = Number(weekEndDaySnapshot.subscribeCount) - Number(lastSnapshot.subscribeCount);

    return await this.ctx.model.PackageSnapshot.upsertWithData({
      period,
      timeId,
      packageId,
      newTeachingCount,
      newLearningCount,
      newSubscribeCount,
      teachingCount: weekEndDaySnapshot.teachingCount,
      learningCount: weekEndDaySnapshot.learningCount,
      subscribeCount: weekEndDaySnapshot.subscribeCount,
    });
  }

  async buildMonthlySnapshot(packageId, time) {
    const period = 'monthly';
    const timeId = time.id;
    const monthEndDaySnapshot = await this.ctx.model.PackageSnapshot.findOne({
      where: {
        packageId,
        timeId: time.monthEndDayId(),
        period: 'daily',
      },
    });
    if (!monthEndDaySnapshot) {
      return await this.ctx.model.PackageSnapshot.upsertWithData({
        period,
        timeId,
        packageId,
        newSubscribeCount: 0,
        newTeachingCount: 0,
        newLearningCount: 0,
        teachingCount: 0,
        learningCount: 0,
        subscribeCount: 0,
      });
    }
    let lastSnapshot = await this.ctx.model.PackageSnapshot.findOne({
      where: {
        packageId,
        timeId: time.lastMonthEndDayId(),
        period: 'monthly',
      },
    });
    if (!lastSnapshot) {
      lastSnapshot = {
        teachingCount: 0,
        learningCount: 0,
        subscribeCount: 0,
      };
    }

    const newTeachingCount = Number(monthEndDaySnapshot.teachingCount) - Number(lastSnapshot.teachingCount);
    const newLearningCount = Number(monthEndDaySnapshot.learningCount) - Number(lastSnapshot.learningCount);
    const newSubscribeCount = Number(monthEndDaySnapshot.subscribeCount) - Number(lastSnapshot.subscribeCount);

    return await this.ctx.model.PackageSnapshot.upsertWithData({
      period,
      timeId,
      packageId,
      newTeachingCount,
      newLearningCount,
      newSubscribeCount,
      teachingCount: monthEndDaySnapshot.teachingCount,
      learningCount: monthEndDaySnapshot.learningCount,
      subscribeCount: monthEndDaySnapshot.subscribeCount,
    });
  }
}

module.exports = PackageSnapshotService;
