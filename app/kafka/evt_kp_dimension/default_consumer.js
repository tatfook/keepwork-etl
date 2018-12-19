'use strict';
const _ = require('lodash');
const Subscription = require('egg').Subscription;

/**
 * Topic evt_kp_dimentsion is aim to handle all create action for dimensions, all these actions should be handle in queue.
 * Include: ['create_user', 'create_lesson_user', 'create_package', 'create_lesson', 'create_question']
 */
class DefaultConsumer extends Subscription {
  async subscribe(message) {
    const data = this.ctx.helper.decodeEventMessage(message);
    const event = data.payload.event;
    try {
      if (_.startsWith(event.action, 'create_')) {
        await this.ctx.service.dimension.create(event);
      } else if (_.startsWith(event.action, 'upsert_')) {
        await this.ctx.service.dimension.upsert(event);
      }
    } catch (e) {
      this.ctx.logger.error('Failed to consume event: ', event);
      // throw e;
    }
  }
}

module.exports = DefaultConsumer;
