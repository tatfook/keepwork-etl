'use strict';
const Subscription = require('egg').Subscription;

class ViewPackageConsumer extends Subscription {
  async subscribe(message) {
    const data = this.ctx.helper.decodeEventMessage(message);
    const event = data.payload.event;
    const timeInstance = this.ctx.model.Time.getTimeByString(event.data.operateAt);
    const fact = this.ctx.model.PackageFact.findOne({
      where: {
        action: event.action,
        timeId: timeInstance.id,
        remark: event.data.remark,
      },
    });
    if (fact) {
      this.ctx.logger.warn('Duplicated view package event: ', event);
      return;
    }
    try {
      await this.ctx.service.fact.package.commonOperate(event);
    } catch (e) {
      this.ctx.logger.error('Failed to consume event: ', event);
      // throw e;
    }
  }
}

module.exports = ViewPackageConsumer;
