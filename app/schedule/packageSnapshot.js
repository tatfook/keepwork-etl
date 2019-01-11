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
    const limit = 100; // process 100 snapshot per loop
    let offset = 0;
    const attributes = [ 'id' ];
    let res = await this.ctx.model.Package.findAll({ attributes, limit, offset });
    const count = res.count;
    const packages = res.data;

    while (offset < count) {
      await Promise.all(packages.map(p => {
        return this.ctx.service.snapshot.package.build(p.id);
      }));
      offset += limit;
      res = await this.ctx.model.Package.findAll({ attributes, limit, offset });
    }
  }
}

module.exports = PackageSnapshot;
