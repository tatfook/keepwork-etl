'use strict';

const Subscription = require('egg').Subscription;

/**
 * Topic evt_kp_dimentsion is aim to handle all create action for dimensions, all these actions should be handle in queue.
 * Include: ['create_user', 'create_lesson_user', 'create_package', 'create_lesson', 'create_question']
 */
class DefaultConsumer extends Subscription {
  async subscribe(message) {
    const data = this.ctx.helper.decodeEventMessage(message);
    console.log('Please consume these data: ', data.payload.event);
    await this.ctx.service.dimension.create(data.payload.event);
  }
}

module.exports = DefaultConsumer;
