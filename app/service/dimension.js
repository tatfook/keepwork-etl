'use strict';

const Service = require('egg').Service;
const _ = require('lodash');

const VALID_DIMENSIONS = [ 'User', 'LessonUser', 'Package', 'Lesson', 'Question' ];

class DimensionService extends Service {
  async create(event) {
    const { ctx } = this;
    const modelName = _.chain(event.action)
      .trimStart('create_')
      .camelCase()
      .capitalize()
      .value();
    if (_.indexOf(VALID_DIMENSIONS, modelName) === -1) {
      ctx.logger.error('Invalid dimension: ', modelName);
      return;
    }
    console.log('create ', modelName, ' with data: ', event.data);
    return ctx.model[modelName].createFromEvent(event.data);
  }
}

module.exports = DimensionService;
