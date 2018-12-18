'use strict';

const Subscription = require('egg').Subscription;

class DefaultConsumer extends Subscription {
  async subscribe(message) {
    const data = this.ctx.helper.decodeEventMessage(message);
    console.log('Please consume these data: ', data);
  }
}

module.exports = DefaultConsumer;
