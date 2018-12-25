'use strict';
const Subscription = require('egg').Subscription;

/**
 * Topic evt_kp_package_fact is aim to handle all operate actions for package.
 * Include: ['submit_package', 'review_package', 'release_package', 'reject_package', 'subsribePackage', 'viewPackage']
 */
class DefaultConsumer extends Subscription {
  async subscribe(message) {
    const data = this.ctx.helper.decodeEventMessage(message);
    const event = data.payload.event;
    try {
      await this.ctx.service.fact.package.commonOperate(event);
    } catch (e) {
      this.ctx.logger.error('Failed to consume event: ', event);
      // throw e;
    }
  }
}

module.exports = DefaultConsumer;
