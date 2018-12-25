'use strict';

const Service = require('egg').Service;
const _ = require('lodash');

class PackageService extends Service {
  async commonOperate(event) {
    if (_.endsWith(event.action, '_package')) {
      event.data.action = event.action;
      return this.ctx.model.PackageFact.createFromEvent(event.data);
    }
    throw new Error('Invalid Action');
  }
}

module.exports = PackageService;
