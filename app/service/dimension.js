'use strict';

const Service = require('egg').Service;
const _ = require('lodash');

const VALID_DIMENSIONS = [ 'User', 'LessonUser', 'Package', 'Lesson', 'Question' ];

class DimensionService extends Service {
  getModelName(action, start) {
    const modelName = _.chain(action)
      .replace(RegExp(`^${start}_`), '')
      .camelCase()
      .capitalize()
      .value();
    if (_.indexOf(VALID_DIMENSIONS, modelName) === -1) {
      this.ctx.logger.error('Invalid dimension: ', modelName);
      return;
    }
    return modelName;
  }
  async create(event) {
    const { ctx } = this;
    const modelName = this.service.dimension.getModelName(event.action, 'create');
    if (!modelName) return;
    console.log('create ', modelName, ' with data: ', event.data);
    return ctx.model[modelName].createFromEvent(event.data);
  }

  async upsert(event) {
    const { ctx } = this;
    const modelName = this.service.dimension.getModelName(event.action, 'upsert');
    if (!modelName) return;
    console.log('upsert ', modelName, ' with data: ', event.data);
    return ctx.model[modelName].upsertFromEvent(event.data);
  }
}

module.exports = DimensionService;
