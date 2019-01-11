'use strict';

const Service = require('egg').Service;

class PackageSnapshotService extends Service {
  async build(packageId) {
    const today = await this.ctx.model.Time.today;
    const lastDay = await this.ctx.model.Time.getTimeByString(today.lastDayId());
    await this.service.snapshot.package.buildDailySnapshot(packageId, lastDay);
    if (today.isWeekBegin()) {
      // do weekly static for last week at the begin of this week
      await this.service.snapshot.package.buildWeeklySnapshot(packageId, lastDay);
    }
    if (today.isMonthBegin()) {
      // do monthly static for last month at the begin of this month
      await this.service.snapshot.package.buildMonthlySnapshot(packageId, today);
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

    const snapshot = await this.ctx.model.PackageSnapshot.create({
      period,
      timeId,
      packageId,
      newSubscribeCount,
      newTeachingCount,
      newLearningCount,
      subscribeCount: lastSnapshot.subscribeCount + newSubscribeCount,
      teachingCount: lastSnapshot.teachingCount + newTeachingCount,
      learningCount: lastSnapshot.learningCount + newLearningCount,
    });

    return snapshot;
  }

  async buildWeeklySnapshot(packageId, time) {
    const { fn, col } = this.ctx.app.Sequelize;
    const period = 'weekly';
    const timeId = time.id;
    let lastSnapshot = await this.ctx.model.PackageSnapshot.findOne({
      where: {
        timeId: time.lastWeekId(),
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
    const res = await this.ctx.model.PackageSnapshot.findAll({
      attributes: [
        [ fn('SUM', col('newSubscribeCount')), 'newSubscribeCount' ],
        [ fn('SUM', col('newTeachingCount')), 'newTeachingCount' ],
        [ fn('SUM', col('newLearningCount')), 'newLearningCount' ],
      ],
      where: {
        packageId,
        period: 'daily',
      },
      include: [{
        model: this.ctx.model.Time,
        attributes: [ ],
        where: {
          week: time.week,
          year: time.year,
          month: time.month,
        },
      }],
      group: [ 'package_snapshots.packageId' ],
    });
    const newSubscribeCount = res[0].newSubscribeCount;
    const newTeachingCount = res[0].newTeachingCount;
    const newLearningCount = res[0].newLearningCount;

    const snapshot = await this.ctx.model.PackageSnapshot.create({
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

    return snapshot;
  }

  async buildMonthlySnapshot(packageId, time) {
    const { fn, col } = this.ctx.app.Sequelize;
    const period = 'monthly';
    const timeId = time.id;
    let lastSnapshot = await this.ctx.model.PackageSnapshot.findOne({
      where: {
        timeId: time.lastMonthId(),
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
    const res = await this.ctx.model.PackageSnapshot.findAll({
      attributes: [
        [ fn('SUM', col('newSubscribeCount')), 'newSubscribeCount' ],
        [ fn('SUM', col('newTeachingCount')), 'newTeachingCount' ],
        [ fn('SUM', col('newLearningCount')), 'newLearningCount' ],
      ],
      where: {
        packageId,
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
      group: [ 'package_snapshots.packageId' ],
    });
    const newSubscribeCount = res[0].newSubscribeCount;
    const newTeachingCount = res[0].newTeachingCount;
    const newLearningCount = res[0].newLearningCount;

    const snapshot = await this.ctx.model.PackageSnapshot.create({
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

    return snapshot;
  }
}

module.exports = PackageSnapshotService;