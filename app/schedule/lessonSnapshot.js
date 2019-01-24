'use strict';

const Subscription = require('egg').Subscription;

class PackageSnapshot extends Subscription {
  static get schedule() {
    return {
      type: 'worker',
      cron: ' 0 0 1 * * *',
    };
  }

  async subscribe() {
    const today = await this.ctx.model.Time.today();
    await this.ctx.service.snapshot.package.buildAll(today);
    await this.ctx.service.snapshot.packageLesson.buildAll(today);
    await this.ctx.service.snapshot.lesson.buildAll(today);
  }
}

module.exports = PackageSnapshot;
