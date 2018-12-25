'use strict';

const Service = require('egg').Service;

class UserSnapshotService extends Service {
  async updateVitality(event) {
    console.log(event);
  }
}

module.exports = UserSnapshotService;
