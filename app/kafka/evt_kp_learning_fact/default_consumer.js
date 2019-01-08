'use strict';
const _ = require('lodash');
const Subscription = require('egg').Subscription;
const SUPPORTED_ACTION = [ 'begin_class', 'end_class', 'begin_learning', 'end_learning', 'quit_learning' ];
/**
 * Topic evt_kp_learning_fact is aim to handle all learning actions for package.
 * Include: ['begin_class', 'end_class', 'begin_learning', 'end_learning']
 */
class DefaultConsumer extends Subscription {
  async subscribe(message) {
    const data = this.ctx.helper.decodeEventMessage(message);
    const event = data.payload.event;
    try {
      if (_.findIndex(SUPPORTED_ACTION, event.action) === -1) {
        throw new Error('Invalid event action: ', event.action);
      }
      const funcName = _.camelCase(event.action);
      await this.ctx.service.fact.learning[funcName](event);
    } catch (e) {
      this.ctx.logger.error('Failed to consume event: ', event);
      // throw e;
    }
  }
}

module.exports = DefaultConsumer;
